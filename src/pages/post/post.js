import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, RichText } from '@tarojs/components'
import { fetchContent } from '../../api/post'
import './post.scss'
import TaroWemark from '../../components/taro-wemark/taro-wemark'
import BackToIndex from '../../components/backToIndex/backToIndex'

export default class Post extends Component{
    config = {
        navigationBarTitleText: '文章加载中……',
        enablePullDownRefresh: false
    }   
     
    constructor() {
        super();
        this.state = {
            title: '',
            category: {
                name: ''
            },
            content: ''
        };

    }
    componentWillMount () {
       const {id}  = this.$router.params 
       Taro.showLoading({
           title: '文章加载中'
       })
       fetchContent(id).then(res => {
           Taro.hideLoading();
           let {title, category, content} = res.data
           Taro.setNavigationBarTitle({
               title
           })
           this.setState({
               id,
               title,
               category,
               content
           })
       })
    }

    componentDidMount () { }

    componentWillUnmount () {
        this.setState({
            title: '',
            category: {
                name: ''
            },
            content: ''
        })     
     }

    componentDidShow () { }

    componentDidHide () { }

    onShareAppMessage () {
        const {id, title} = this.state;
        return {
            title,
            path: '/pages/post/post?id=' + id
        }
    }

    render () {
        return (
            <View className='post-warpper clearfix'>
                <BackToIndex></BackToIndex>
                <View className='post-header'>
                    <View className='post-title'>{this.state.title}</View>
                    {
                        this.state.category.name && 
                        <View className='post-info'> {'/ ' + this.state.category.name + ' /'}</View>
                    }
                </View>
                <View className='post-body'>
                    { 
                        this.state.content && <TaroWemark md={this.state.content}></TaroWemark> 
                    }    
                </View> 
            </View>
        )
    }
}