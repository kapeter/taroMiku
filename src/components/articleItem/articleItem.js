import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import "./articleItem.scss"

export default class ArticleItem extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    /**
     * 跳转到文章内容页
     * 
     * @param {Int} id - 文章id 
     * @param {Object} e - 事件对象
     */
    turnToContent (id, e) {
        e.stopPropagation();
        Taro.navigateTo({
            url: `/pages/post/post?id=${id}`
        })
    }
    
    render () {
        return (
            <View className='article-box' onClick={this.turnToContent.bind(this, this.props.post.id)}>
                <Text className='category'>/ { this.props.post.category.name } /</Text>
                <Text className='title'>{ this.props.post.title }</Text>
                <Text className='description'>{ this.props.post.description }</Text>
                <View className='view-count'>
                    <Text className='iconfont icon-eye'></Text>{ this.props.post.view_count }
                </View>
            </View>
        )
    }
}
  
  