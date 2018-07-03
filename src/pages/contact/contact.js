import Taro, { Component } from '@tarojs/taro'
import { View, Text, Textarea, Input, Button } from '@tarojs/components'
import { postContactForm } from '../../api/contact'
import './contact.scss'

export default class Contact extends Component{
    config = {
        navigationBarTitleText: '联系我',
        enablePullDownRefresh: false
    }  

    constructor() {
        super();
        this.state = {
            errorText: ''
        }
        this.validate = this.validate.bind(this); 
    }

    onShareAppMessage () {
        return {
            title: '联系我 / kapeter',
            path: '/pages/contact/contact'
        }
    }
    /**
     * 表单提交
     * 
     * @param {Object} e - 提交信息 
     */
    formSubmit (e) {
        let data = e.detail.value;
        if (this.validate(data)){
            Taro.showLoading({
                title: "表单提交中"
            })
            postContactForm(data).then((res) => {
                Taro.hideLoading();
                if (res.code == 10000){
                    Taro.showToast({
                        title: "提交成功",
                        icon: 'success',
                        duration: 2000
                    }).then(() => {
                        setTimeout(() => {
                            Taro.redirectTo({
                                url: "/pages/index/index"
                            })
                        },1500)
                    })
                } else {
                    Taro.showToast({
                        title: "提交失败",
                        icon: "none",
                        duration: 2000
                    })                    
                }

            })
        }
    }

    validate (data) {
        let errorText = ''
        for (let x in data) {
            switch (x) {
                case 'name':
                    errorText = !data[x] ? '发件人不能为空' : '';
                    break;
                case 'email':
                    let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+\.([a-zA-Z0-9_-])+/
                    errorText = !data[x] ? '联系邮箱不能为空' : '';
                    errorText = !reg.test(data[x]) ? '请输入正确的邮箱地址' : '';
                    break;
                case 'subject':
                    errorText = !data[x] ? '邮件主题不能为空' : '';
                    break;
                case 'content':
                    errorText = !data[x] ? '邮件内容不能为空' : '';
                    break;
            }
            if (errorText) break; 
        }
        this.setState({
            errorText
        })
        if (errorText) {
            return false
        } else {
            return true;
        }
    }
    
    handleCancel () {
        Taro.showModal({
            title: "系统确认",
            content: "您填写的表单信息将不被保存！"
        }).then((res) => {
            if (res.confirm) {
                Taro.redirectTo({
                    url: "/pages/index/index"
                })
            }
        })
    }

    render() {
        return (
            <View className='contact'>
                <Form onSubmit={this.formSubmit}>
                    <Input placeholder='发件人' name='name'></Input>
                    <Input placeholder='联系邮箱' name='email'></Input>
                    <Input placeholder='邮件主题' name='subject'></Input>
                    <Textarea placeholder='邮件内容' name='content'></Textarea>

                    {
                        errorText && <Text className='error'>{this.state.errorText}</Text>
                    }

                    <View className='fixed-bottom'>
                        <Button className='btn' formType='submit'>提 交</Button>
                        <View className='cancel' onClick={this.handleCancel}>暂不提交</View>
                    </View>
                </Form>
            </View>
        )
    }
}
