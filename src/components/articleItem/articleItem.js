import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import "./articleItem.scss"

export default class ArticleItem extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }
    render () {
        return (
            <View className='article-box'>
                <Text className='category'>/ { this.props.article.category.name } /</Text>
                <Text className='title'>{ this.props.article.title }</Text>
                <View className='view-count'>
                    <Text className='iconfont icon-eye'></Text>{ this.props.article.view_count }
                </View>
                
            </View>
        )
    }
}
  
  