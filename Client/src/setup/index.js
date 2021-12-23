import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import md5 from 'md5'
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';

import AuthService from '../common/authService'

class Setup extends React.Component {

    constructor(props) {
        super(props);
        this.authService = new AuthService()
        this.state = {
            step: 0,
            step0Status: '',
            step1Status: '',

            connuser: '',
            connpwd: '',
            connaddress: '',
            connport: '',
            conndatabase: '',

            configuser: '',
            configpwd: '',
            configdisplayname: ''
        }
    }

    onClickStep = (v) => {
        switch (parseInt(v)) {
            case 0:
                const conn = JSON.stringify({
                    connuser: this.state.connuser,
                    connpwd: this.state.connpwd,
                    connaddress: this.state.connaddress,
                    connport: this.state.connport,
                    conndatabase: this.state.conndatabase
                })
                this.authService.postData('/setup', conn).then(res => {
                    if (res.result) {
                        this.setState({ step: 1 })
                    } else {
                        this.setState({ step0Status: res.message })
                    }
                })
                break;
            case 1:
                const user = JSON.stringify({
                    configuser: this.state.configuser,
                    configpwd: md5(this.state.configpwd),
                    configdisplayname: this.state.configdisplayname
                })
                this.authService.postData('/setup/user', user).then(res => {
                    if (res.result) {
                        this.setState({ step: 2 })
                    } else {
                        this.setState({ step1Status: res.message })
                    }
                })
                break;
            default:
                break
        }
    }

    onChangeConnUser = (e) => {
        this.setState({ connuser: e.target.value })
    }

    onChangeConnPWD = (e) => {
        this.setState({ connpwd: e.target.value })
    }

    onChangeConnAddress = (e) => {
        this.setState({ connaddress: e.target.value })
    }

    onChangeConnPort = (e) => {
        this.setState({ connport: e.target.value })
    }

    onChangeConnDatabase = (e) => {
        this.setState({ conndatabase: e.target.value })
    }

    onChangeConfigUser = (e) => {
        this.setState({ configuser: e.target.value })
    }

    onChangeConfigPWD = (e) => {
        this.setState({ configpwd: e.target.value })
    }

    onChangeConfigDisplyName = (e) => {
        this.setState({ configdisplayname: e.target.value })
    }

    onClickLogin = () => {
        this.props.history.push('/')
    }

    render() {

        const { classes } = this.props

        return (
            <Fragment>
                <CssBaseline />
                <Container maxWidth="xl" className={classes.Content}>
                    <Typography component="div" className={classes.left}>
                        <img src={require('../assets/loginbg.png')} alt="" />
                    </Typography>
                    <Typography component="div" className={classes.right}>
                        <Grid container className={classes.box} justify={"center"} direction={'column'}>
                            <Typography variant="h5">安装并设置</Typography>
                            <Typography variant="h4" style={{ color: '#848484', margin: '4px 0' }}>企业文档管理与分享平台</Typography>

                            <Divider className={classes.divider} />
                            {
                                this.state.step === 0 ?
                                    <>
                                        <Typography variant="overline" style={{ color: '#848484' }}>配置连接MongoDB数据库：</Typography>
                                        <Grid item xs={12} style={{ margin: '20px 0' }}>
                                            <Grid container spacing={2}>
                                                <Grid item>
                                                    <TextField
                                                        label="连接数据库账户"
                                                        onChange={this.onChangeConnUser}
                                                        value={this.state.connuser}
                                                        className={classes.text}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        label="密码"
                                                        type={'password'}
                                                        onChange={this.onChangeConnPWD}
                                                        value={this.state.connpwd}
                                                        className={classes.text}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        label="服务器地址"
                                                        onChange={this.onChangeConnAddress}
                                                        value={this.state.connaddress}
                                                        className={classes.text}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        label="端口"
                                                        onChange={this.onChangeConnPort}
                                                        value={this.state.connport}
                                                        className={classes.text}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        label="数据库名称"
                                                        onChange={this.onChangeConnDatabase}
                                                        value={this.state.conndatabase}
                                                        className={classes.text}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Typography variant="overline" style={{ color: '#848484' }}>验证结果：{this.state.step0Status}</Typography>
                                    </>
                                    :
                                    this.state.step === 1 ?
                                        <>
                                            <Typography variant="overline" style={{ color: '#848484' }}>设置系统管理员：</Typography>
                                            <Grid item xs={12} style={{ margin: '20px 0' }}>
                                                <Grid container spacing={2}>
                                                    <Grid item>
                                                        <TextField
                                                            label="账户名(邮箱格式)"
                                                            onChange={this.onChangeConfigUser}
                                                            value={this.state.configuser}
                                                            className={classes.text}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <TextField
                                                            label="密码"
                                                            type={'password'}
                                                            onChange={this.onChangeConfigPWD}
                                                            value={this.state.configpwd}
                                                            className={classes.text}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <TextField
                                                            label="显示名称"
                                                            onChange={this.onChangeConfigDisplyName}
                                                            value={this.state.configdisplayname}
                                                            className={classes.text}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Typography variant="overline" style={{ color: '#848484' }}>设置结果：{this.state.step1Status}</Typography>
                                        </>
                                        :
                                        <Typography variant="overline" style={{ color: '#848484' }}>配置完成,请重新登录.</Typography>
                            }
                            <Divider className={classes.divider} />

                            <Grid item xs={12}>
                                {
                                    parseInt(this.state.step) === 2 ?
                                        <Grid container justify="flex-end" spacing={2}>
                                            <Grid item>
                                                <Button
                                                    style={{ width: 100 }}
                                                    onClick={this.onClickLogin}
                                                >
                                                    {'登录'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        :
                                        <Grid container justify="flex-end" spacing={2}>
                                            <Grid item>
                                                <Button
                                                    style={{ width: 100 }}
                                                    disabled={parseInt(this.state.step) === 0 ? true : false}
                                                >
                                                    {'上一步'}
                                                </Button>
                                            </Grid>

                                            <Grid item>
                                                <Button
                                                    style={{ width: 80 }}
                                                    onClick={() => this.onClickStep(this.state.step)}
                                                >
                                                    {'下一步'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                }
                            </Grid>

                        </Grid>
                    </Typography>
                </Container>

            </Fragment>
        )
    }
}

Setup.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = theme => ({
    Content: {
        display: 'flex',
        padding: 0,
    },
    left: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        height: '100vh',
        width: 480,
    },
    right: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 900
    },
    box: {
        padding: '0 150px',
        width: 900
    },
    divider: {
        margin: '20px 0'
    },
    text: {
        width: 600
    },
    icon: {
        color: 'gray',
        marginTop: '18px',
        marginRight: '8px'
    },
    paper: {
        height: 140,
        width: 100,
    },
    rightIcon: {
        marginRight: 8
    },
    cover: {
        width: 80,
        height: 100,
        cursor: 'pointer'
    }
})

export default withStyles(styles)(Setup);