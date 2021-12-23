import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import GroupAdd from '@material-ui/icons/LibraryAdd';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Chip from '@material-ui/core/Chip';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Popover from '@material-ui/core/Popover';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import ArrowForward from '@material-ui/icons/ArrowForward';
import TextField from '@material-ui/core/TextField';

import AuthService from '../common/authService'
import Loading from '../common/loading'

class role extends Component {
    _isMounted = true;
    constructor(props) {
        super(props)
        this.authService = new AuthService()
        this.state = {
            open: false,
            anchorEl: null,
            rightDrawer: false,
            noticeMessage: null,
            datas: [],
            usersList: [],
            roleId: '',
            searchTextField: '',
            searchUsersList: [],
        }
    }

    componentDidMount() {
        this.props.onChangeBarTitle('人员角色')
        this.RefreshInfo()
        this.props.onChangeChildFuncion(this)
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    RefreshInfo() {
        this.props.onChangeRefresh(true)
        this.authService.postData('/role/home', null).then((res) => {
            if (this._isMounted) {
                if (res.result) {
                    this.setState({ datas: res.message })
                    this.props.onChangeRefresh(false)
                }
                else {
                    this.setState({ open: !this.state.open, noticeMessage: res.message })
                    this.props.onChangeRefresh(false)
                }
            }
        })
    }

    onClickNavigationAdd = () => {
        this.props.history.push(`/roleadd`)
    }

    onClickRemoveUser = (roleId, userId) => {
        const data = JSON.stringify({
            userId: userId,
            roleId: roleId
        })

        this.authService.postData('/role/removeuser', data).then((res) => {
            if (res.result) {
                this.setState({ open: !this.state.open, noticeMessage: res.message })
                this.RefreshInfo()
            }
            else {
                this.setState({ open: !this.state.open, noticeMessage: res.message })
            }
        })
    }

    onClickOpenUserList = (e) => {
        this.props.onChangeRefresh(true)

        this.setState({ roleId: e, rightDrawer: !this.state.rightDrawer })
        this.authService.postData('/role/rolegetlist', null).then((res) => {
            if (res.result) {
                this.setState({ usersList: res.message, searchUsersList: res.message })
            }
            else {
            }
            this.props.onChangeRefresh(false)
        })
    }

    onClickNoticeClose = () => {
        this.setState({ open: !this.state.open })
    }

    onClickListItemSelectUser = (e) => {
        const data = JSON.stringify({
            userId: e,
            roleId: this.state.roleId
        })

        this.authService.postData('/role/adduser', data).then((res) => {
            if (res.result) {
                this.setState({ rightDrawer: !this.state.rightDrawer })
                this.RefreshInfo()
            }
        })
    }

    onClickOpenMenu = event => {
        this.setState({
            anchorEl: event.currentTarget,
            roleId: event.currentTarget.getAttribute("data-id")
        });
    };

    onClickCloseMenu = () => {
        this.setState({ anchorEl: null })
    }

    onClickCloseRightDrawer = () => {
        this.setState({ rightDrawer: !this.state.rightDrawer })
    }

    onClickDeleteRole = () => {
        const data = JSON.stringify({
            _id: this.state.roleId
        })

        this.authService.postData('/role/del', data).then((res) => {
            if (res.result) {
                this.setState({ anchorEl: null, open: !this.state.open, noticeMessage: res.message })
                this.RefreshInfo()
            }
            else {
                this.setState({ open: !this.state.open, noticeMessage: res.message })
            }
        })
    }

    onChangeSearchUsersList = (e) => {
        this.setState({ searchTextField: e.target.value }, () => {
            let newUserList = this.state.usersList.filter(x => {
                return x.accountName.indexOf(this.state.searchTextField) !== -1 || x.displayName.indexOf(this.state.searchTextField) !== -1
            })
            this.setState({ searchUsersList: newUserList })
        })
    }

    render() {
        const { classes } = this.props;
        const { datas, searchUsersList, searchTextField, anchorEl, rightDrawer } = this.state
        const MenuOpen = Boolean(anchorEl);

        return (
            <Fragment>
                {
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Button variant="contained" color="primary" onClick={this.onClickNavigationAdd}><GroupAdd /></Button>
                    </div>
                }

                <div style={{ margin: 15 }} />

                {
                    datas.length > 0 ?
                        datas.map((v, i) => {
                            return <Paper key={i}>
                                <Paper className={classes.bar}>
                                    <b>{v.displayName}</b>
                                    <div style={{ display: 'flex', height: 48, marginRight: -12, marginTop: -12 }}>
                                        <IconButton
                                            onClick={() => this.onClickOpenUserList(v._id)}
                                            style={{ marginRight: -8 }}
                                        >
                                            <PersonAdd style={{ color: 'white' }} />
                                        </IconButton>
                                        <IconButton
                                            data-id={v._id}
                                            onClick={this.onClickOpenMenu}
                                        >
                                            <DeleteForeverIcon style={{ color: 'white' }} />
                                        </IconButton>
                                        <Popover
                                            open={MenuOpen}
                                            anchorEl={anchorEl}
                                            onClose={this.onClickCloseMenu}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'center',
                                            }}
                                            elevation={1}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'center',
                                            }}
                                        >
                                            <Button onClick={this.onClickDeleteRole}>是</Button>
                                            <Divider />
                                            <Button onClick={this.onClickCloseMenu}>否</Button>
                                        </Popover>
                                    </div>
                                </Paper>
                                <Grid container style={{ marginBottom: 15, padding: 15 }}>
                                    <Grid item xs={12}>
                                        {
                                            v.member.map((x, y) => {
                                                return <Chip
                                                    key={y}
                                                    label={`${x.displayName === '' ? x.accountName : x.displayName}`}
                                                    onClick={null}
                                                    onDelete={() => this.onClickRemoveUser(v._id, x.id)}
                                                    className={classes.chip}
                                                    variant="outlined"
                                                />
                                            })
                                        }
                                    </Grid>
                                </Grid>
                            </Paper>
                        })
                        :
                        <Paper style={{ padding: '10px 0' }}>
                            <Loading number={[0, 1, 2, 3, 4]} />
                        </Paper>
                }

                {
                    <Drawer
                        anchor="right"
                        variant="persistent"
                        open={rightDrawer}
                        classes={{
                            paperAnchorRight: classes.drawerPaper
                        }}
                    >
                        <div className={classes.toolbar} />
                        <div className={(ClassNames(classes.toolbar, classes.drawerToolBar))}>
                            <IconButton onClick={this.onClickCloseRightDrawer}><ArrowForward style={{ color: 'white', fontSize: 28 }} /></IconButton>
                            <div />
                        </div>
                        <TextField
                            className={classes.searchTextField}
                            label="搜索(用户名或姓名)"
                            value={searchTextField}
                            onChange={this.onChangeSearchUsersList}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                        <List className={classes.list} dense={true}>
                            {
                                searchUsersList.map((v, i) => {
                                    return <ListItem
                                        key={i}
                                        button
                                        onClick={() => this.onClickListItemSelectUser(v._id)}
                                    >
                                        <Avatar alt="" src="/imgs/user/default.png" />
                                        <ListItemText primary={v.accountName} secondary={v.displayName} />
                                    </ListItem>
                                })
                            }
                        </List>
                    </Drawer>
                }

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

role.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    chip: {
        margin: theme.spacing(1),
    },
    toolbar: theme.mixins.toolbar,
    drawerToolBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: theme.palette.primary.main
    },
    bar: {
        display: 'flex',
        justifyContent:
            'space-between',
        height: 40,
        backgroundColor: theme.palette.primary.main,
        padding: '8px 20px 8px 20px',
        color: 'white'
    },
    list: {
        width: '100%',
        maxWidth: 360,
        maxHeight: 400,
        paddingTop: 0,
        paddingBottom: 0
    },
    drawerPaper: {
        width: 360,
        boxShadow: '0px 4px 6px 0px rgba(0,0,0,0.2)',
    },
    searchTextField: {
        margin: '10px 5px'
    }
});

export default withStyles(styles)(role);