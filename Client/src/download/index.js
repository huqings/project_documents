import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import AuthService from '../common/authService'

class Download extends Component {

    constructor(props) {
        super(props);
        this.authService = new AuthService()
        this.state = {
            sid: '',
            fileId: '',
            fileName: '',
            expireTime: '',
            fileSize: 0,
            downloadCode: '',
            loading: false,
            message: '加载中...',
        }
    }

    componentWillMount() {

        const info = JSON.stringify({ id: this.props.location.pathname.split('/')[2] })

        this.authService.postData('/download', info).then(res => {
            if (res.result) {
                this.setState({
                    sid: res.message.sid,
                    fileId: res.message.fileId,
                    fileName: res.message.filename,
                    expireTime: this.timestampToTime(res.message.expireTime),
                    fileSize: res.message.size,
                    message: ''
                })
            } else {
                this.setState({
                    fileName: res.message,
                    message: ''
                })
            }
        })


    }

    onClickDownloadFile = () => {

        var info = JSON.stringify({
            id: this.state.sid,
            downloadCode: this.state.downloadCode
        })

        this.setState({
            message: '正在下载中...请勿关闭页面!'
        })

        this.authService.downloadPublicFile('/download/file', info).then(res => res.blob().then(blob => {
            if (res.headers.get('Content-Disposition').length > 0) {
                if (window.navigator.msSaveOrOpenBlob) {
                    let filename = res.headers.get('Content-Disposition');
                    window.navigator.msSaveOrOpenBlob(blob, filename);
                }
                else {
                    var a = document.createElement('a');
                    var url = window.URL.createObjectURL(blob);
                    let filename = res.headers.get('Content-Disposition');
                    a.href = url;
                    a.download = decodeURI(filename);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    
                }
            }
            else {
                this.setState({
                    message: '下载码不正确或已过期!'
                })
            }
        }))

    }

    onChangeDownloadCode = (e) => {
        this.setState({ downloadCode: e.target.value })
    }

    timestampToTime(timestamp) {

        var date = new Date(timestamp);

        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

        return Y + M + D;

    }

    render() {

        const { classes } = this.props

        return (
            <div className={classes.container}>
                <Card className={classes.card}>
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Typography component="h5" variant="h5">
                                {this.state.fileName}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {`文件大小:${this.state.fileSize}MB`}
                            </Typography>
                            {
                                this.state.message !== '' ?
                                    <Typography variant="subtitle2" style={{ color: 'red' }}>
                                        {`提示:${this.state.message}`}
                                    </Typography> : null
                            }
                        </CardContent>
                        <div className={classes.controls}>
                            <TextField
                                id="standard-full-width"
                                label="下载码"
                                style={{ margin: 8 }}
                                value={this.state.downloadCode}
                                onChange={(e) => this.onChangeDownloadCode(e)}
                                placeholder="四位数字或没有"
                                helperText={`过期时间:${this.state.expireTime}`}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                    </div>
                    <Button variant="contained" color="primary" className={classes.cover} onClick={this.onClickDownloadFile}>
                        {'下载'}
                    </Button>
                </Card>
            </div>
        )
    }
}

Download.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = theme => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
    },
    card: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        width: 320
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 64,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    }
})

export default withStyles(styles)(Download);