import React from 'react';

export default class Follow extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="ani-box">
                <img src={require('../assets/images/face.jpg')} width="100" className="animated fadeInUp lastPic" />
                <span className="animated tada ege">我的头像</span>
            </div>
        )
    }
}
