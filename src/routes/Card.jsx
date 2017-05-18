import React from 'react'
import { Card, Spin } from 'antd';

// 引入标准Fetch及IE兼容依赖
import 'whatwg-fetch';

export default class myCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:true,
            lists: []
        }
    }

    // 获取数据
    fetchFn() {
        fetch('/api/list')
            .then((res) => {
                console.log(res);
                return res.json() ;
            })
            .then((data) => {
                this.setState({
                    loading:false,
                    lists:data.listData
                })
            })
            .catch((e) => {
                console.log(e.message);
            })
    }

    componentDidMount() {
        this.fetchFn()
    }

    render() {
        return (
            <Spin tip="Loading..." spinning={this.state.loading}>
                <Card title="资源导航" style={{ width: "800px", margin: "0 auto" }} className="animated zoomIn" >
                    {
                        this.state.lists.map((v,i) => {
                            return (
                                <p key={i} className="doclist"><a href={ v.url } target="_blank">{ v.title }</a></p>
                            )
                        })
                    }
                </Card>
            </Spin>
        )
    }
}

