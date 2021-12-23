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
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import ReplyIcon from '@material-ui/icons/Reply';
import Grid from '@material-ui/core/Grid';
import querySearch from "stringquery";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DesktopAccessDisabledIcon from '@material-ui/icons/DesktopAccessDisabled';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';

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

class Edit extends React.Component {

    constructor(props) {
        super(props);
        this.authService = new AuthService()
        this.state = {
            value: 0,
            open: false,
            noticeMessage: '',
            result: {
                _id: '',
                accountName: '',
                displayName: '',
                phone: '',
                birthday: '',
                department: '',
                title: '',
                address: '',
                status: false,
                role: '',
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
        this.props.onChangeBarTitle('编辑人员')
        this.RefreshInfo()
        this.props.onChangeChildFuncion(this)
    }

    RefreshInfo() {
        this.props.onChangeRefresh(true)
        const info = JSON.stringify({
            _id: querySearch(this.props.location.search).id
        })
        this.authService.postData('/user/find', info).then((res) => {
            if (res.result) {
                this.setState({ result: res.message })
                this.props.onChangeRefresh(false)
            } else {
                this.setState({ open: true, noticeMessage: res.message })
                this.props.onChangeRefresh(false)
            }
        })
    }

    onChangeTab = (_, value) => {
        this.setState({ value });
    };

    onChangeStatus = () => {
        const { result } = { ...this.state };
        const currentState = result;
        currentState['status'] = !this.state.result.status
        this.setState({ result: currentState })
    }

    onChangeField = (e) => {
        const { result } = { ...this.state };
        const currentState = result;
        const { id, value } = e.target;
        currentState[id] = value;

        this.setState({ result: currentState });
    }

    onClickSave = () => {
        this.props.onChangeRefresh(true)
        let info = JSON.stringify(this.state.result)
        this.authService.postData('/user/edit', info).then((res) => {
            this.setState({ open: true, noticeMessage: res.message })
            this.props.onChangeRefresh(false)
        })
    }

    onChangeDeleteUser = () => {
        const info = JSON.stringify({
            id: this.state.result._id
        })

        this.authService.postData('/user/del', info).then((res) => {
            if (res.result) {
                this.props.history.push(`/muser`)
            }
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
                        <Grid container spacing={2} alignItems="flex-end">
                            <Grid item xs={4}>
                                <TextField
                                    id="accountName"
                                    fullWidth
                                    label="邮箱"
                                    InputProps={{
                                        disabled: true,
                                    }}
                                    value={result.accountName}
                                    onChange={null}
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
                        <Grid container spacing={8} alignItems="flex-end">
                            <Grid item xs={4}>
                                <TextField
                                    id="role"
                                    fullWidth
                                    label="角色"
                                    value={result.role}
                                    InputProps={{
                                        disabled: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ height: 30 }}></Grid>
                            <Grid item xs={4}>
                                <DesktopAccessDisabledIcon style={{ color: 'red', marginTop: 12, marginRight: 12 }} />
                                <FormControl component="fieldset">
                                    <FormLabel>该用户当前是否被禁止使用？</FormLabel>
                                    <RadioGroup
                                        row
                                        name="status"
                                        aria-label="status"
                                        value={result.status ? '1' : '0'}
                                        onChange={this.onChangeStatus}
                                    >
                                        <FormControlLabel value={'0'} control={<Radio />} label="是" />
                                        <FormControlLabel value={'1'} control={<Radio />} label="否" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                }
                <Card className={classes.bottomCard}>
                    <CardActions className={classes.bottomButton}>
                        <div>
                            <Button variant="contained" color="primary" className={classes.extendedIcon} onClick={this.onClickBack}><ReplyIcon className={classes.extendedIcon} />返回</Button>
                            <Button variant="contained" color="primary" onClick={this.onClickSave}><SaveIcon className={classes.extendedIcon} />保存</Button>
                        </div>
                        <div>
                            <Button variant="contained" color='primary' onClick={this.onChangeDeleteUser}><DeleteIcon className={classes.extendedIcon} />删除</Button>
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

Edit.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Edit);