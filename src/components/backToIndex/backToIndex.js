import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import "./backToIndex.scss"

export default class BackToIndex extends Component {

    constructor () {
        super();
        this.state = {
            isShow: false
        }
    }

    componentWillMount () {
        let pages = getCurrentPages();
        let isShow = pages.length < 2;
        this.setState({
            isShow
        })
    }
    /**
     * 跳转到文章内容页
     * 
     * @param {Object} e - 事件对象
     */
    turnToIndex (e) {
        e.stopPropagation();
        Taro.redirectTo({
            url: '/pages/index/index'
        })
    }
    
    render () {
        return (
            <View>
                {
                    isShow && 
                    <View className='back-home' onClick={this.turnToIndex}>
                        <Text className='iconfont icon-home'></Text>
                    </View>
                }
            </View>

        )
    }
}
  
  