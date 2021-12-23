import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Grid from '@material-ui/core/Grid';
import querySearch from "stringquery";
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import md5 from 'md5'

import AuthService from '../common/authService'

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

class Passwrd extends React.Component {

    constructor(props) {
        super(props);
        this.authService = new AuthService()
        this.state = {
            value: 0,
            open: false,
            noticeMessage: '',
            _id: querySearch(this.props.location.search).id,
            passWord: '',
            rePassWord: '',
            result: {
                _id: '',
                accountName: '',
                displayName: ''
            },

        };
    }

    onChangeTab = (_, value) => {
        this.setState({ value });
    };

    onClickBack = () => {
        this.props.history.go(-1)
    }

    componentDidMount() {
        this.props.onChangeBarTitle('重置密码')
        this.RefreshInfo()
        this.props.onChangeChildFuncion(this)
    }

    RefreshInfo() {
        this.props.onChangeRefresh(true)

        const info = JSON.stringify({
            _id: this.state._id
        })

        this.authService.postData('/user/find', info).then((res) => {
            if (res.result) {
                this.setState({ result: res.message })
                this.props.onChangeRefresh(false)
            } else {
                this.setState({ data: [], open: true, noticeMessage: res.message })
                this.props.onChangeRefresh(false)
            }
        })
    }

    onChangeFieldPwd = (e) => {
        this.setState({ passWord: e.target.value })
    }

    onChangeFieldRePwd = (e) => {
        this.setState({ rePassWord: e.target.value })
    }

    onClickSave = () => {
        if (this.state.passWord === '' || this.state.rePassWord === '') {
            this.setState({ open: true, noticeMessage: '修改密码不能为空' })
            return false
        }
        if (this.state.passWord === this.state.rePassWord) {
            this.props.onChangeRefresh(true)
            let info = JSON.stringify({
                _id: this.state._id,
                passWord: md5(this.state.passWord),
                rePassWord: md5(this.state.rePassWord)
            })
            this.authService.postData('/user/pwd', info).then((res) => {
                this.setState({ open: true, noticeMessage: res.message })
                this.props.onChangeRefresh(false)
            })
        } else {
            this.setState({ open: true, noticeMessage: '修改密码不一致' })
        }

    }

    onClickNoticeClose = () => {
        this.setState({ open: false });
    };

    render() {

        const { classes } = this.props;
        const { value, result, open, noticeMessage, passWord, rePassWord } = this.state;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Tabs value={value}>
                        <Tab label="基本资料" />
                    </Tabs>
                </AppBar>
                {
                    value === 0 &&
                    <CardContent className={classes.cardContent}>
                        <Grid container spacing={2} alignItems="flex-end">
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    label="邮箱"
                                    InputProps={{
                                        disabled: true,
                                    }}
                                    value={result.accountName}
                                    onChange={null}
                                />
                            </Grid>
                            <Grid item xs={12}></Grid>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    label="姓名"
                                    InputProps={{
                                        disabled: true,
                                    }}
                                    value={result.displayName}
                                    onChange={null}
                                />
                            </Grid>
                            <Grid item xs={12}></Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="passWord"
                                    fullWidth
                                    label="设置密码"
                                    type={'password'}
                                    value={passWord}
                                    onChange={this.onChangeFieldPwd}
                                />
                            </Grid>
                            <Grid item xs={8}></Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="rePassWord"
                                    fullWidth
                                    label="确认密码"
                                    type={'password'}
                                    value={rePassWord}
                                    onChange={this.onChangeFieldRePwd}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                }
                <Card className={classes.bottomCard}>
                    <CardActions className={classes.bottomButton}>
                        <div>
                            <Button variant="contained" color="primary" className={classes.extendedIcon} onClick={this.onClickBack}><ArrowBackIcon className={classes.extendedIcon} />返回</Button>
                        </div>
                        <div>
                            <Button variant="contained" color="primary" onClick={this.onClickSave}><SaveIcon className={classes.extendedIcon} />保存</Button>
                        </div>
                    </CardActions>
                </Card>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={open}
                    onClose={this.onClickNoticeClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                >
                    <SnackbarContent
                        aria-describedby="client-snackbar"
                        message={
                            <span style={{ display: 'flex', alignItems: 'center', }}>
                                {noticeMessage}
                            </span>
                        }
                    />
                </Snackbar>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    },
    bottomCard: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0
    },
    bottomButton: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '0 20px'
    },
    cardContent: {
        padding: '30px 40px 30px 40px'
    }
});

Passwrd.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Passwrd);