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
import md5 from 'md5'
import TextField from '@material-ui/core/TextField';
import ReplyIcon from '@material-ui/icons/Reply';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

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

class Add extends React.Component {

    constructor(props) {
        super(props);
        this.authService = new AuthService()
        this.state = {
            value: 0,
            open: false,
            noticeMessage: '',
            result: {
                accountName: '',
                passWord: '',
                displayName: '',
                phone: '',
                birthday: '',
                department: '',
                title: '',
                address: '',
                level: 1,
                role: '',
                permission: {}
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
        this.props.onChangeBarTitle('新建人员')
    }

    onChangeTab = (_, value) => {
        this.setState({ value });
    };

    onChangeField = (e) => {
        const { result } = { ...this.state };
        const currentState = result;
        const { id, value } = e.target;
        currentState[id] = value;

        this.setState({ result: currentState });
    }

    onClickSave = () => {
        this.props.onChangeRefresh(true)

        let reg = /[^\s@]+@[^\s@]+\.[^\s@]+/

        if (!reg.test(this.state.result.accountName)) {
            this.setState({ open: true, noticeMessage: '邮箱格式不正确,请重新输入!' })
            this.props.onChangeRefresh(false)
            return false
        }

        if (this.state.result.passWord === '' || this.state.result.passWord === null) {
            this.setState({ open: true, noticeMessage: '密码没有设置,请填写完整!' })
            this.props.onChangeRefresh(false)
            return false
        } else {
            const { result } = { ...this.state };
            const currentState = result;
            currentState['passWord'] = md5(this.state.result.passWord)
            this.setState({ result: currentState })
        }

        let info = JSON.stringify(this.state.result)

        this.authService.postData('/user/add', info).then((res) => {

            const { result } = { ...this.state };
            const currentState = result;
            currentState['accountName'] = ''
            currentState['passWord'] = ''
            currentState['displayName'] = ''

            this.setState({ open: true, noticeMessage: res.message, result: currentState })
            this.props.onChangeRefresh(false)
        })

    }

    onClickNoticeClose = () => {
        this.setState({ open: false });
    };

    render() {

        const { classes } = this.props;
        const { value, result, open, noticeMessage } = this.state;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Tabs value={value} onChange={this.onChangeTab}>
                        <Tab label="基本资料" />
                        <Tab label="相关信息" />
                    </Tabs>
                </AppBar>
                {
                    value === 0 &&
                    <CardContent className={classes.cardContent}>
                        <Grid container spacing={4} alignItems="flex-end">
                            <Grid item xs={4}>
                                <TextField
                                    id="accountName"
                                    fullWidth
                                    label="邮箱"
                                    value={result.accountName}
                                    onChange={this.onChangeField}
                                />
                            </Grid>
                            <Grid item xs={8}></Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="passWord"
                                    type="password"
                                    fullWidth
                                    label="密码"
                                    value={result.passWord}
                                    onChange={this.onChangeField}
                                />
                            </Grid>
                            <Grid item xs={8}></Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="displayName"
                                    fullWidth
                                    label="姓名"
                                    value={result.displayName}
                                    onChange={this.onChangeField}
                                />
                            </Grid>
                            <Grid item xs={8}></Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="phone"
                                    fullWidth
                                    label="电话"
                                    value={result.phone}
                                    onChange={this.onChangeField}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="birthday"
                                    fullWidth
                                    type="date"
                                    label="生日"
                                    value={result.birthday}
                                    onChange={this.onChangeField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="department"
                                    fullWidth label="部门"
                                    value={result.department}
                                    onChange={this.onChangeField}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="title"
                                    fullWidth label="岗位"
                                    value={result.title}
                                    onChange={this.onChangeField}
                                />
                            </Grid>
                            <Grid item xs={4}></Grid>
                            <Grid item xs={8}>
                                <TextField
                                    id="address"
                                    fullWidth
                                    label="地址"
                                    value={result.address}
                                    onChange={this.onChangeField}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                }
                {
                    value === 1 &&
                    <CardContent className={classes.cardContent}>
                        <Grid container spacing={4} alignItems="flex-end">
                            <Grid item xs={4}>
                                <TextField
                                    id="role"
                                    fullWidth
                                    label="所属角色"
                                    value={result.role}
                                    onChange={this.onChangeField}
                                />
                            </Grid>
                            <Grid item xs={8}></Grid>
                        </Grid>
                    </CardContent>
                }
                <Card className={classes.bottomCard}>
                    <CardActions className={classes.bottomButton}>
                        <div>
                            <Button variant="contained" color="primary" className={classes.extendedIcon} onClick={this.onClickBack}><ReplyIcon className={classes.extendedIcon} />返回</Button>
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
        padding: '15px 40px 30px 40px'
    }
});

Add.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Add);