import React from 'react';
import AgoraRTC from 'agora-rtc-sdk';
import config from '../config.json';

class Main extends React.Component {
    componentWillMount() {
        let $ = this.props
        // init AgoraRTC local client
        this.client = AgoraRTC.createClient({ mode: 'live' })
        this.client.init(config.AgoraAppId, () => {
            console.log("AgoraRTC client initialized")
            this.client.join($.appId, $.channel, $.uid, (uid) => {
                console.log("User " + uid + " join channel successfully")
                console.log('At ' + new Date().toLocaleTimeString())
                // create local stream
                // It is not recommended to setState in function addStream
                this.localStream = this.streamInit(uid, $.attendeeMode, $.videoProfile)
                this.localStream.init(() => {
                    if ($.attendeeMode !== 'audience') {
                        this.addStream(this.localStream, true)
                        this.client.publish(this.localStream, err => {
                            console.log("Publish local stream error: " + err);
                        })
                    }
                    this.setState({ readyState: true })
                },
                    err => {
                        console.log("getUserMedia failed", err)
                        this.setState({ readyState: true })
                    })
            })
        })
    }

    componentDidMount() {
        if (!AgoraRTC.checkSystemRequirements()) {
            alert("Your browser does not support WebRTC!");
        } else {
            console.log("Browser supports RTC")
        }
    }



    render() {
        return (
            <div>main</div>
        )
    }
}

export default Main;