import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import TextField from '@material-ui/core/TextField';
import MailIcon from '@material-ui/icons/Mail';
import Grid from '@material-ui/core/Grid';
import Lock from '@material-ui/icons/Lock';
import md5 from 'md5'
import AuthService from '../common/authService'
import { Link } from 'react-router-dom';

class SignIn extends React.Component {
    _Mount = true
    constructor(props) {
        super(props);
        this.authService = new AuthService()
        this.state = {
            open: false,
            noticeMessage: null,
            username: '',
            password: '',
            repassword: ''
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleEnterKey);
    }

    componentWillUmount() {
        document.removeEventListener("keydown", this.handleEenterKey);
    }

    handleEnterKey = (e) => {
        if (e.keyCode === 13) {
            this.onClickRegister()
        }
    }

    onClickRegister = () => {
        if (this.state.username !== '' && this.state.password !== '' && this.state.password === this.state.repassword) {

            let reg = /[^\s@]+@[^\s@]+\.[^\s@]+/

            if (!reg.test(this.state.username)) {
                this.setState({ open: true, noticeMessage: '邮箱格式不正确,请重新输入!' })
                return false
            }

            const datas = JSON.stringify({
                username: this.state.username,
                password: md5(this.state.password)
            })

            this.authService.postData('/login/register', datas).then((res) => {
                if (this._Mount) {
                    if (res.result) {
                        this.setState({
                            username: '', password: '', repassword: '',
                            open: true, noticeMessage: res.message
                        })
                    } else {
                        this.setState({ open: true, noticeMessage: res.message })
                    }
                }
            })
        }
        else {
            this.setState({
                open: true, noticeMessage: '邮箱或密码填写有误或未填写完整!'
            })
        }
    }

    componentWillUnmount() {
        this._Mount = false
    }

    onChangeUserName = (e) => {
        this.setState({ username: e.target.value })
    }

    onChangePassword = (e) => {
        this.setState({ password: e.target.value })
    }

    onChangeRePassword = (e) => {
        this.setState({ repassword: e.target.value })
    }

    onClickNoticeOpen = () => {
        this.setState({ open: true });
    };

    onClickNoticeClose = () => {
        this.setState({ open: false });
    };

    render() {

        return (
            <Fragment>
                <Grid container justify={"center"}>
                    <Grid item xs={12} sm={10} md={6} lg={4}>
                        <Paper style={{ height: 530, marginTop: 120 }} elevation={12}>
                            <div style={{ height: 220, backgroundColor: '#3F51B5', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}><img src='/imgs/logo_big.png' alt='' style={{ height: 60, marginTop: 30 }} /></div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}><Typography style={{ color: 'white', marginTop: 40 }}>已有登录邮箱?<Link to='/' style={{ color: 'white' }}>登录</Link></Typography></div>
                            </div>
                            <Paper style={{ height: 260, margin: '-60px 40px 0 40px', padding: 30 }} elevation={12}>
                                <Grid container justify={"center"} direction={'column'}>
                                    <Grid container spacing={4} alignItems="flex-end" alignContent="center" >
                                        <Grid item>
                                            <MailIcon />
                                        </Grid>
                                        <Grid item lg={10} md={10} sm={10} xl={10} xs={10}>
                                            <TextField id="input-mail-1" fullWidth label="邮箱" onChange={this.onChangeUserName} value={this.state.username} />
                                        </Grid>
                                    </Grid>

                                    <div style={{ margin: 10 }} />

                                    <Grid container spacing={4} alignItems="flex-end" alignContent="center" >
                                        <Grid item>
                                            <Lock />
                                        </Grid>
                                        <Grid item lg={10} md={10} sm={10} xl={10} xs={10}>
                                            <TextField id="input-passwrd-1" type={'password'} fullWidth label="设置密码" onChange={this.onChangePassword} value={this.state.password} />
                                        </Grid>
                                    </Grid>

                                    <div style={{ margin: 10 }} />

                                    <Grid container spacing={4} alignItems="flex-end" alignContent="center" >
                                        <Grid item>
                                            <Lock />
                                        </Grid>
                                        <Grid item lg={10} md={10} sm={10} xl={10} xs={10}>
                                            <TextField id="input-passwrd-2" type={'password'} fullWidth label="确认密码" onChange={this.onChangeRePassword} value={this.state.repassword} />
                                        </Grid>
                                    </Grid>

                                    <Grid item style={{ margin: '30px 20px 20px 20px' }}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={this.onClickRegister}
                                        >
                                            注册
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Paper>

                    </Grid>
                </Grid>

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
        )
    }
}

export default SignIn;