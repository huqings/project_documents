import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import TextField from '@material-ui/core/TextField';
import EmailIcon from '@material-ui/icons/MailOutline';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import md5 from 'md5'
import Lock from '@material-ui/icons/LockOutlined';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import InputIcon from '@material-ui/icons/Input';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';

import user0 from '../assets/user0.jpeg'
import user1 from '../assets/user1.jpeg'
import user2 from '../assets/user2.jpeg'
import AuthService from '../common/authService'
import { LocalStorageKey } from '../common/config'

const info = [
    {
        username: 'yongdingrui@contoso.com',
        password: '123456'
    }, {
        username: 'jindn@contoso.com',
        password: '123456'
    }, {
        username: 'gujz@contoso.com',
        password: '123456'
    }
]

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
            title: ''
        }
    }

    componentWillMount() {
        this.authService.postData('/login/init', null).then(res => {
            if (this._Mount) {
                if (res.result) {
                    this.props.history.push('/setup')
                }
            }
        })
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleEnterKey);
    }

    componentWillUmount() {
        document.removeEventListener("keydown", this.handleEenterKey);
        this._Mount = false
    }

    handleEnterKey = (e) => {
        if (e.keyCode === 13) {
            this.onClickLogin()
        }
    }

    onClickLogin = () => {

        if (this.state.username !== '' && this.state.password !== '') {

            let reg = /[^\s@]+@[^\s@]+\.[^\s@]+/

            if (!reg.test(this.state.username)) {
                this.setState({ open: true, noticeMessage: '邮箱格式不正确,请重新输入!' })
                return false
            }

            const datas = JSON.stringify({
                username: this.state.username,
                password: md5(this.state.password)
            })

            this.authService.login(datas).then(res => {
                if (this._Mount) {
                    if (res.result) {
                        localStorage.setItem(LocalStorageKey, JSON.stringify(res.message))
                        this.setState({ username: '', password: '' })
                        this.props.history.push('/')
                    } else {
                        this.setState({ open: true, noticeMessage: res.message })
                    }
                }
            })
        }
        else {
            this.setState({ open: true, noticeMessage: '邮箱或密码未填写完整!' })
        }
    }

    onChangeUserName = (e) => {
        this.setState({ username: e.target.value })
    }

    onChangePassword = (e) => {
        this.setState({ password: e.target.value })
    }

    onClickNoticeOpen = () => {
        this.setState({ open: true });
    };

    onClickNoticeClose = () => {
        this.setState({ open: false });
    };

    onClickReset = () => {
        this.setState({ username: '', password: '' });
    }

    onClickGetLoginInfo = (e) => {
        this.setState({ username: info[e].username, password: info[e].password });
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
                            <Typography variant="h5" className={classes.logoText}>企业文档管理与分享平台</Typography>
                            <Typography style={{ color: '#848484', margin: '4px 0' }}>Welcome back , Please sign in to your account.</Typography>
                            <Typography style={{ color: '#848484' }}>一套文档集中式管理与安全有序分享的企业级解决方案。</Typography>

                            <Divider className={classes.divider} />

                            <Grid item xs={12}>
                                <Grid container justify="center">
                                    <Typography style={{ color: 'rgba(179, 179, 179, 1)', margin: '-16px 0 8px 0' }}>公共账号</Typography>
                                </Grid>
                                <Grid container justify="center" spacing={2}>
                                    <Grid item>
                                        <Card>
                                            <CardMedia
                                                className={classes.cover}
                                                image={user0}
                                                title="王小川"
                                                onClick={() => this.onClickGetLoginInfo(0)}
                                            />
                                        </Card>
                                    </Grid>
                                    <Grid item>
                                        <Card>
                                            <CardMedia
                                                className={classes.cover}
                                                image={user1}
                                                title="王丽"
                                                onClick={() => this.onClickGetLoginInfo(1)}
                                            />
                                        </Card>
                                    </Grid>
                                    <Grid item>
                                        <Card>
                                            <CardMedia
                                                className={classes.cover}
                                                image={user2}
                                                title="张伟"
                                                onClick={() => this.onClickGetLoginInfo(2)}
                                            />
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} style={{ margin: '30px 0' }}>
                                <Grid container justify="center" spacing={2}>
                                    <EmailIcon className={classes.icon} />
                                    <TextField
                                        className={classes.text}
                                        label="邮箱"
                                        onChange={this.onChangeUserName}
                                        value={this.state.username}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <Lock className={classes.icon} />
                                    <TextField
                                        className={classes.text}
                                        type={'password'}
                                        label="密码"
                                        onChange={this.onChangePassword}
                                        value={this.state.password}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Divider className={classes.divider} />

                            <Grid item xs={12}>
                                <Grid container justify="flex-end" spacing={2}>
                                    <Grid item>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            style={{ width: 100 }}
                                            onClick={this.onClickLogin}
                                        >
                                            <InputIcon className={classes.rightIcon} />
                                            {'登录'}
                                        </Button>
                                    </Grid>

                                    <Grid item>
                                        <Button
                                            style={{ width: 80 }}
                                            onClick={this.onClickReset}
                                        >
                                            {'重置'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Typography>
                </Container>

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

SignIn.propTypes = {
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
        margin: '30px 0'
    },
    logoText: {
        fontSize: '1.8rem',
        lineHeight: '1.8'
    },
    icon: {
        color: 'gray',
        marginTop: '18px',
        marginRight: '8px'
    },
    text: {
        width: 260
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

export default withStyles(styles)(SignIn);