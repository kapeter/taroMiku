import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { fetchPost, fetchCategory } from '../../api/index'
// import ArticleItem from '../../components/articleItem/articleItem'
import './index.scss'
import errorImg from '../../images/error.png'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页',
    enablePullDownRefresh: false
  }

  constructor() {
    super();
    this.state = {
      categoryItems: [],
      postItems: [],
      categoryCount: 0,
      activeIndex: 0,
      lineLeft: 0,
      lineWidth: 0,
      transLeft: 0,
      originLeft: 0,
      startX: 0,
      startY: 0,
      startT: 0,
      winWidth: 0,
      isTouchEnd: false,
      transition: 'all 0.25s ease-out',
      isBottom: false,
      winHeight: 0,
      animationData: {},
      lineAnimation: {}
    };

    this.setLinePosition = this.setLinePosition.bind(this);
    this.getPostData = this.getPostData.bind(this);
    this.calcIndex = this.calcIndex.bind(this);
  }

  componentWillMount () {
    Taro.getSystemInfo().then(res => {
      this.setState({
        winWidth: res.windowWidth,
        winHeight: res.windowHeight
      })
    })
  }

  componentDidMount () {
    Taro.showLoading({
      title: '加载中',
    })
    Promise.all([
      fetchCategory(),
      fetchPost()
    ]).then(res => {
      Taro.hideLoading();
      const [categoryRes, postRes] = res
      let categoryItems = categoryRes.data;
      categoryItems.unshift({id:0, name: '所有文章'});
      let categoryCount = categoryItems.length;
      let postItems = [];
      for (let i = 0; i < categoryCount; i++) {
        postItems.push({
          idx: i,
          isLoading: false,
          data: [],
          pagination: {},
          isLast: false
        })
      }
      Object.assign(postItems[0], {
        data: postRes.data,
        pagination: postRes.meta.pagination
      })
      this.setState({
        categoryItems,
        categoryCount,
        postItems,
      })
      
      setTimeout(() => {
        this.setLinePosition();
      }, 50)
      
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onPullDownRefresh () {
    let index = this.state.activeIndex;
    this.getPostData(index);
    Taro.stopPullDownRefresh();
  }
  /**
   * 上划触底事件
   */
  handleScrolltolower () {
    let {activeIndex, postItems, categoryItems} = this.state;
    let catId = categoryItems[activeIndex].id;

    let isLast = postItems[activeIndex].pagination.total_pages == postItems[activeIndex].pagination.current_page

    if (postItems[activeIndex].isLast || isLast) return false;

    let page = ++postItems[activeIndex].pagination.current_page;
    this.setState({
      isBottom: true
    })
    
    fetchPost(catId, page).then(res =>{
      let newData = postItems[activeIndex].data.concat(res.data);
      let isLast = res.meta.pagination.total_pages === res.meta.pagination.current_page 
      Object.assign(postItems[activeIndex], {
        data: newData,
        pagination: res.meta.pagination,
        isLast
      })  
      this.setState({
        postItems,
        isBottom: false
      })
    })

  }

  setLinePosition() {
    let query = Taro.createSelectorQuery();
    query.select(".tab-active").boundingClientRect().exec((res) =>{
      let {left, right} = res[0];
      let lineLeft = left + 15;
      let lineWidth = right - left - 30;

      let animation = Taro.createAnimation({
        duration: 250,
        timingFunction: 'ease-out',
      })
      animation.left(lineLeft).width(lineWidth).step();
      this.setState({
        lineAnimation: animation.export(),
      })
    })
  }

  handleTabClick(id, index, e) {
    let {winWidth, postItems} = this.state;
    let transLeft = -winWidth * index;

    if (JSON.stringify(postItems[index].pagination) == '{}'){
      this.getPostData(index);
    }
  
    let animation = Taro.createAnimation({
      duration: 250,
      timingFunction: 'ease-out',
    })
    animation.translate3d(transLeft, 0, 0).step();

    this.setState({
      activeIndex: index,
      transLeft,
      animationData: animation.export()
    })

    setTimeout(() => {
      this.setLinePosition();
    }, 50)
  }
  /**
   * Tab滚动事件
   */
  handleScroll() {
    let query = Taro.createSelectorQuery();
    query.select(".tab-active").boundingClientRect().exec((res) =>{
      let {left} = res[0];
      let lineLeft = left + 15;
      let animation = Taro.createAnimation({
        duration: 250,
        timingFunction: 'ease-out',
      })
      animation.left(lineLeft).step();
      this.setState({
        lineAnimation: animation.export(),
      })
    })  
  }
  /**
   * 获取当前栏目文章
   */
  getPostData(index) {
    let catId = this.state.categoryItems[index].id;
    let postItems = this.state.postItems;
    postItems[index].isLoading = true;
    this.setState({
      postItems
    })    
    fetchPost(catId).then(res =>{
      Object.assign(postItems[index], res, {
        data: res.data,
        pagination: res.meta.pagination,
        isLoading: false
      })  
      this.setState({
        postItems
      })
    })
  }

  /**
   *  滑动开始事件
   */
  handleTouchStart(e) {
    //e.stopPropagation();
    const { pageX, pageY } = e.changedTouches[0];
    this.setState({
      startX: pageX,
      startY: pageY,
      startT: new Date().getTime(),
      isTouchEnd: false,
      originLeft: this.state.transLeft,
      transition: ''
    })

  }

  /**
   *  滑动事件
   */
  handleTouchMove(e) {
    //e.stopPropagation();
    const {isTouchEnd, startX, startY, winWidth, categoryCount, originLeft} = this.state;
    const { pageX, pageY } = e.changedTouches[0];

    if (isTouchEnd) return false;
    
    let deltaX = pageX - startX;
    let deltaY = pageY - startY;
    let maxWidth = -winWidth * (categoryCount - 1);
    
    if (Math.abs(deltaX) > Math.abs(deltaY)){
      let transLeft = originLeft + deltaX;
      //如果translate>0 或 < maxWidth,则表示页面超出边界
      if (transLeft <= 0 && transLeft >= maxWidth){
        let animation = Taro.createAnimation({
          duration: 0,
          timingFunction: 'ease-out',
        })
        animation.translate3d(transLeft, 0, 0).step();
        this.setState({
          animationData: animation.export(),
          transLeft
        })
      }

    }
  }

  /**
   *  滑动结束事件 
   */
  handleTouchEnd(e) {
   // e.stopPropagation();
    this.calcIndex(e);
  }

  /**
   * 计算滑动后的结果
   * 
   * @param {Object} e - 滑动事件的event 
   */
  calcIndex (e) {
    const {startT, startX, isTouchEnd, winWidth, originLeft, postItems, categoryCount} = this.state
    const { pageX, pageY } = e.changedTouches[0];

    let deltaX = pageX - startX;
    let deltaT = new Date().getTime() - startT;
    let transLeft = 0;
    let activeIndex = 0;
    let maxWidth = -winWidth * (categoryCount - 1);

    if (!isTouchEnd) { 

      if (deltaT < 300 || Math.abs(deltaX) / winWidth >= 0.5) {
        transLeft = deltaX < 0 ? originLeft - winWidth : originLeft + winWidth;
        transLeft = transLeft > 0 ? 0 : transLeft; //左边界
        transLeft = transLeft < maxWidth ? maxWidth : transLeft; //右边界

        activeIndex = Math.abs(transLeft / winWidth);    
        if (JSON.stringify(postItems[activeIndex].pagination) == '{}'){
          this.getPostData(activeIndex);
        }
        setTimeout(() => {
          this.setLinePosition();
        }, 50)    
      }

      if (deltaT > 300 && Math.abs(deltaX) / winWidth < 0.5) {
        transLeft = originLeft;
        activeIndex = Math.abs(transLeft / winWidth);
      }
    }
    let animation = Taro.createAnimation({
      duration: 250,
      timingFunction: 'ease-out',
    })
    animation.translate3d(transLeft, 0, 0).step();

    this.setState({
      activeIndex,
      transLeft,
      animationData: animation.export(),
      isTouchEnd: true
    })
  }


  render () {
    return (
      <View>
        <View className='tabs-warpper'>
          <ScrollView className='tabs-container' scrollX onScroll={this.handleScroll}>
            {this.state.categoryItems.length > 0 && this.state.categoryItems.map((category, index) =>
              <Text className={'tab-item ' + (this.state.activeIndex == index ? ' tab-active' : '')} 
                key={category.id}
                onClick={this.handleTabClick.bind(this, category.id, index)}>
                { category.name }
              </Text>
            )}
          </ScrollView>
          <View className='active-line' animation={this.state.lineAnimation}></View>
        </View>

        <View className='articles-warpper'
          onClick={this.handleClick}
          onTouchstart={this.handleTouchStart}
          onTouchmove={this.handleTouchMove}
          onTouchend={this.handleTouchEnd}
          onTouchCancel={this.handleTouchEnd}>
          <View className='articles-container' 
            style={ `width: ${this.state.categoryCount}00%;`} animation={this.state.animationData}>
              {this.state.postItems.length > 0 && this.state.postItems.map((posts) =>
                <ScrollView className='articles-list' key={posts.idx} scrollY	style={`height: ${this.state.winHeight}px`} onScrolltolower={this.handleScrolltolower}>
                  {!posts.isLoading && (posts.data.length > 0 ? 
                    posts.data.map((post) =>
                      <View className='article-box' key={post.id}>
                        <Text className='category'>/ { post.category.name } /</Text>
                        <Text className='title'>{ post.title }</Text>
                        <Text className='description'>{ post.description }</Text>
                        <View className='view-count'>
                            <Text className='iconfont icon-eye'></Text>{ post.view_count }
                        </View>
                      </View>
                    ) :
                    <View className='unusual-box'>
                      <Image src={errorImg}></Image>
                      <Text>该栏目下暂无文章</Text>
                    </View>
                  )}  
                  { posts.isLoading && 
                    <View className='unusual-box'>
                      <Text>数据加载中……</Text>
                    </View>
                  }
                  { posts.isLast &&
                    <View className='bottom-box'>
                      <Text>已经到底啦~~</Text>
                    </View>
                  }
                </ScrollView> 
              )}          
          </View>
          {this.state.isBottom &&
            <View className='bottom-box'>
              <Text>更多文章正在袭来……</Text>
            </View>
          }
        </View>
      </View>
    )
  }
}

