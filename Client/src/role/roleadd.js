import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import ReplyIcon from '@material-ui/icons/Reply';
import Grid from '@material-ui/core/Grid';
import AuthService from '../common/authService'
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

class RoleAdd extends Component {
    constructor(props) {
        super(props)
        this.authService = new AuthService()
        this.state = {
            value: 0,
            open: false,
            noticeMessage: null,
            roleName: '',
            roleDescription: ''
        };
    }

    componentWillMount() {
        this.props.onChangeBarTitle('增加角色')
    }

    onChangeTabIndex = (_, value) => {
        this.setState({ value });
    };

    onClickNavigationBack = () => {
        this.props.history.go(-1)
    }

    onChangeRoleName = (e) => {
        this.setState({ roleName: e.target.value })
    }

    onChangeRoleDescription = (e) => {
        this.setState({ roleDescription: e.target.value })
    }

    onChangeSubmit = () => {

        if (this.state.roleName === '' || this.state.roleDescription === '') {
            this.setState({ open: true, noticeMessage: '必填信息有误' })
            return false;
        }

        this.props.onChangeRefresh(true)
        let info = JSON.stringify({
            displayName: this.state.roleName,
            description: this.state.roleDescription,
            module: ['_3', '0']
        })
        this.authService.postData('/role/add', info).then((res) => {
            this.setState({ open: true, noticeMessage: res.message, roleName: '', roleDescription: '' })
            this.props.onChangeRefresh(false)
        })
    }

    onClickNoticeClose = () => {
        this.setState({ open: !this.state.open })
    }

    render() {
        const { classes } = this.props;
        const { value, roleName, roleDescription } = this.state;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Tabs value={value} onChange={this.onChangeTabIndex}>
                        <Tab label="角色属性" />
                    </Tabs>
                </AppBar>
                {
                    value === 0 &&
                    <CardContent className={classes.cardContent}>
                        <Grid container spacing={8} alignItems="flex-end">
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    label="角色名称"
                                    value={roleName}
                                    onChange={this.onChangeRoleName}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={8}></Grid>
                            <Grid item xs={8}>
                                <TextField
                                    fullWidth
                                    label="角色描述"
                                    multiline
                                    rows="4"
                                    value={roleDescription}
                                    onChange={this.onChangeRoleDescription}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}></Grid>
                            <Grid item xs={12}></Grid>
                        </Grid>
                    </CardContent>
                }
                <Card className={classes.bottomCard}>
                    <CardActions className={classes.bottomButton}>
                        <Button variant="contained" color="primary" className={classes.extendedIcon} onClick={this.onClickNavigationBack}><ReplyIcon className={classes.extendedIcon} />返回</Button>
                        <Button variant="contained" color="primary" onClick={this.onChangeSubmit}><SaveIcon className={classes.extendedIcon} />保存</Button>
                    </CardActions>
                </Card>

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
            </div>
        );
    }
}

RoleAdd.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    bottomButton: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    extendedIcon: {
        marginRight: 4
    }
});

export default withStyles(styles)(RoleAdd);