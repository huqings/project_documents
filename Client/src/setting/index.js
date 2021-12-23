import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import NavigationIcon from '@material-ui/icons/Navigation';

import AuthService from '../common/authService'

class Setting extends Component {
    constructor(props) {
        super(props)
        this.authService = new AuthService()
        this.state = {
            value: 0,
            serverinfo: null,
            fileupload: null,
            quotaAndexpire: null
        }
    }

    componentWillMount() {
        this.props.onChangeBarTitle('全局配置')
        this.RefreshInfo()
        this.props.onChangeChildFuncion(this)
    }

    RefreshInfo() {
        this.props.onChangeRefresh(true)

        this.authService.postData('/setting/home', null).then((res) => {
            if (res.result) {
                console.log(res.message.serverinfo)
                this.setState({
                    serverinfo: res.message.serverinfo,
                    fileupload: res.message.fileupload,
                    quotaAndexpire: res.message.quotaAndexpire,
                })
                this.props.onChangeRefresh(false)
            }
            else {
                this.setState({ open: true, noticeMessage: res.message })
                this.props.onChangeRefresh(false)
            }
        })
    }

    onChangeTabsChange = (_, value) => {
        this.setState({ value });
    };

    onClickNoticeClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        const { value, serverinfo, fileupload, quotaAndexpire } = this.state;
        return (
            <Fragment>
                <div className={classes.root}>
                    <AppBar position="static">
                        <Tabs value={value} onChange={this.onChangeTabsChange}>
                            <Tab label="文件服务器" />
                            <Tab label="配额与过期" />
                            <Tab label="文件归档" />
                            <Tab label="数据备份" />
                            <Tab label="抹除数据" />
                        </Tabs>
                    </AppBar>
                    {
                        value === 0 && fileupload !== null &&
                        <div className={classes.margin}>
                            <div className={classes.labelmargin}>
                                <InputLabel>
                                    {'服务器名称:'}
                                </InputLabel>
                                <InputLabel className={classes.label}>
                                    {serverinfo.serverName}
                                </InputLabel>
                            </div>
                            <div className={classes.labelmargin}>
                                <InputLabel>
                                    {'存储空间总大小:'}
                                </InputLabel>
                                <InputLabel className={classes.label}>
                                    {serverinfo.serverAvailableSpace}
                                </InputLabel>
                            </div>
                            <div className={classes.labelmargin}>
                                <InputLabel>
                                    {'可用空间大小:'}
                                </InputLabel>
                                <InputLabel className={classes.label}>
                                    {serverinfo.serverUsedSpace}
                                </InputLabel>
                            </div>
                            <div className={classes.labelmargin}>
                                <InputLabel>
                                    {'服务器地址:'}
                                </InputLabel>
                                <InputLabel className={classes.label}>
                                    {serverinfo.serverIPAddress}
                                </InputLabel>
                            </div>
                        </div>
                    }
                    {
                        value === 1 && fileupload !== null &&
                        <div className={classes.margin}>
                            <div className={classes.labelmargin}>
                                <InputLabel>
                                    {'文件上传限制大小:'}
                                </InputLabel>
                                <InputLabel className={classes.label}>
                                    {(fileupload.upladFileSize / 1024 / 1024).toFixed(3)} MB
                                </InputLabel>
                            </div>
                            <div className={classes.labelmargin}>
                                <InputLabel>
                                    {'上传禁止文件格式:'}
                                </InputLabel>
                                <InputLabel className={classes.label}>
                                    {fileupload.excludeExtension}
                                </InputLabel>
                            </div>
                        </div>
                    }
                    {
                        value === 2 && quotaAndexpire !== null &&
                        <div className={classes.margin}>
                            <div className={classes.labelmargin}>
                                <InputLabel>
                                    {'公有分享过期默认时间:'}
                                </InputLabel>
                                <InputLabel className={classes.label}>
                                    {quotaAndexpire.fileShareExpires} day
                                </InputLabel>
                            </div>
                        </div>
                    }
                    {
                        value === 3 &&
                        <div className={classes.margin}>
                            <div className={classes.labelmargin}>
                                <InputLabel>
                                    {'文档库内容归档'}
                                </InputLabel>
                                <Button variant="contained" color="primary" className={classes.button}>
                                    <NavigationIcon className={classes.extendedIcon} />执行
                                </Button>
                            </div>
                        </div>
                    }
                    {
                        value === 4 &&
                        <div className={classes.margin}>
                            <div className={classes.labelmargin}>
                                <InputLabel>
                                    {'抹除所有文档'}
                                </InputLabel>
                                <Button variant="contained" color="primary" className={classes.button}>
                                    <NavigationIcon className={classes.extendedIcon} />执行
                                </Button>
                            </div>
                        </div>
                    }
                </div>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={this.state.open}
                    onClose={this.onClickNoticeClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                >
                    <SnackbarContent
                        aria-describedby="client-snackbar"
                        message={
                            <span style={{ display: 'flex', alignItems: 'center', }}>
                                {this.state.noticeMessage}
                            </span>
                        }
                    />
                </Snackbar>
            </Fragment>
        );
    }
}

Setting.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    margin: {
        padding: '20px 30px'
    },
    labelmargin: {
        padding: 5
    },
    input: {
        margin: theme.spacing(1)
    },
    label: {
        color: 'green',
        marginLeft: theme.spacing(2)
    },
    button: {
        marginTop: theme.spacing(2)
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
});

export default withStyles(styles)(Setting);