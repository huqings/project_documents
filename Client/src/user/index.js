import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewListIcon from '@material-ui/icons/ViewList';
import SearchIcon from '@material-ui/icons/Search';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import UserCard from './userCard'
import Loading from '../common/loading'
import AuthService from '../common/authService'

class User extends React.Component {
    _isMounted = true;
    constructor(props) {
        super(props)
        this.authService = new AuthService()
        this.state = {
            loading: false,
            open: false,
            noticeMessage: null,
            userListLayout: 1,
            count: 0,
            number: 6,
            before: 0,
            after: 6,
            datas: [],
            page: 0,
            searchButton: false,
            disabled: false,
            disabledColor: false,
            userSearch: ''
        }
    }

    handleChange = (_, value) => {
        this.setState({ value });
    };

    componentDidMount() {
        this.props.onChangeBarTitle('人员列表')
        this.RefreshInfo()
        this.props.onChangeChildFuncion(this)
    }

    RefreshInfo() {
        this.props.onChangeRefresh(true)

        this.setState({ datas: [] })

        let info = JSON.stringify({
            before: this.state.before,
            after: this.state.after
        })

        this.authService.postData('/user/home', info).then((res) => {
            if (this._isMounted) {
                if (res.result) {
                    this.setState({ datas: res.message })
                    this.props.onChangeRefresh(false)
                } else {
                    this.setState({ open: !this.state.open, noticeMessage: res.message })
                    this.props.onChangeRefresh(false)
                }
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    updateRefreshPage = () => {
        this.RefreshInfo()
    }

    onChangeUserList = (e) => {
        this.setState({ userListLayout: e })
    }

    onClickSearchBtn = () => {
        this.setState({ searchButton: !this.state.searchButton })
    }

    onChangeUserSearch = (e) => {
        this.setState({ userSearch: e.target.value })
    }

    onClickUserSearch = () => {
        this.props.onChangeRefresh(true)
        let info = JSON.stringify({
            userSearch: this.state.userSearch
        })

        this.authService.postData('/user/query', info).then((res) => {
            if (res.result) {
                this.setState({ datas: res.message })
                this.props.onChangeRefresh(false)
            }
            else {
                this.setState({ open: !this.state.open, noticeMessage: res.message })
            }
        })
    }

    onClickNavigateBefore = () => {
        this.setState({
            count: this.state.count - 1,
            before: (this.state.count - 1) * this.state.number,
            after: (this.state.count) * this.state.number
        }, () => { this.RefreshInfo() })
    }

    onClickNavigateNext = () => {
        this.setState({
            count: this.state.count + 1,
            before: (this.state.count + 1) * this.state.number,
            after: (this.state.count + 2) * this.state.number
        }, () => {
            this.RefreshInfo()
        })
    }

    onClickNoticeClose = () => {
        this.setState({ open: !this.state.open })
    }


    render() {
        const { classes } = this.props;
        const { userSearch, datas, userListLayout } = this.state

        return (
            <Fragment>

                <div style={{ display: 'flex', justifyContent: 'space-between', height: 36 }}>
                    <div style={{ display: 'flex' }}>
                        <Button variant="contained" color="primary" disabled={userListLayout === 1} onClick={() => this.onChangeUserList(1)}><ViewModuleIcon /></Button>
                        <Button variant="contained" color="primary" disabled={userListLayout === 2} onClick={() => this.onChangeUserList(2)} className={classes.buttonLeftSpace}><ViewListIcon /></Button>
                    </div>

                    <div style={this.state.searchButton ? { margin: '-12px 12px 0px 12px', width: '100%' } : { display: 'none' }}>
                        <div style={{ display: 'flex' }}>
                            <TextField fullWidth label="用户名或姓名" value={userSearch} onChange={this.onChangeUserSearch} />
                            <Button color="primary" className={classes.userSearchBtn} onClick={this.onClickUserSearch} >搜索</Button>
                        </div>
                    </div>
                    <Button variant="contained" color="primary" onClick={this.onClickSearchBtn}><SearchIcon /></Button>
                </div>

                <div style={{ margin: 15 }} />

                <Fragment>
                    <Grid container spacing={1}>
                        {
                            datas.length > 0 ?
                                datas.map((v, i) => {
                                    return (
                                        <Grid key={i} item xs={userListLayout === 1 ? 4 : 12}>
                                            <UserCard uid={v._id} listLayout={userListLayout === 1} status={v.status} updateRefreshPage={this.updateRefreshPage} accountName={v.accountName} brithday={v.birthday} displayName={v.displayName} phone={v.phone} title={v.title} department={v.department} address={v.address} history={this.props.history} />
                                        </Grid>
                                    )
                                })
                                :
                                [1, 2, 3].map((_, i) => {
                                    return (
                                        <Grid key={i} item xs={4}>
                                            <Paper style={{ padding: '10px 0' }}>
                                                <Loading number={[0, 1, 2, 3, 4]} />
                                            </Paper>
                                        </Grid>
                                    )
                                })
                        }
                    </Grid>

                    <Paper style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 16, padding: '4px 0' }}>
                        <Button size={'small'} color="default" disabled={this.state.before <= 0} onClick={() => this.onClickNavigateBefore()} ><NavigateBeforeIcon /></Button>
                        <Typography component={'span'} style={{ lineHeight: 2, padding: '0 8px' }}>{this.state.count + 1}</Typography>
                        <Button size={'small'} color="default" disabled={this.state.number > this.state.datas.length} onClick={() => this.onClickNavigateNext()} ><NavigateNextIcon /></Button>
                    </Paper>
                </Fragment>

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
            </Fragment >
        );
    }
}

User.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 200,
        width: '100%',
    },
    control: {
        padding: theme.spacing(2),
    },
    buttonLeftSpace: {
        marginLeft: theme.spacing(1),
    },
    avatar: {
        width: 80,
        height: 80,
    },
    list_user_card: {
        padding: '4px 0',
        marginLeft: -26
    },
    listItem_user_card: {
        paddingTop: 0,
        paddingBottom: 0
    },
    listItemText_user_card: {
        paddingLeft: 4
    },
    userSearchBtn: {
        height: 36,
        marginTop: 12
    },
    progress: {
        margin: theme.spacing(2),
    }
});

export default withStyles(styles)(User);