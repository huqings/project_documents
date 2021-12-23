import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CardMembershipIcon from '@material-ui/icons/CardMembership';
import DateRangeIcon from '@material-ui/icons/DateRange';
import SettingsPhoneIcon from '@material-ui/icons/SettingsPhone';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PinDropIcon from '@material-ui/icons/PinDrop';
import BusinessIcon from '@material-ui/icons/Business';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import BlockIcon from '@material-ui/icons/Block';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import AuthService from '../common/authService'

class UserCard extends Component {

    constructor(props) {
        super(props)
        this.authService = new AuthService()
        this.state = {
            disabled: props.status,
            anchorEl: null,
        }
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    onClickUserEdit = (e) => {
        this.props.history.push(`/uedit?id=${e}`)
    }

    onClickUserPwd = (e) => {
        this.props.history.push(`/pwd?id=${e}`)
    }

    render() {
        const { classes } = this.props;
        const { disabled, anchorEl } = this.state

        return (
            <Paper className={classes.paper}>
                <Paper className={classes.bar}>
                    {disabled ? <b>{this.props.displayName}</b> : <b>{this.props.displayName}(已禁用)</b>}
                    <span
                        aria-owns={anchorEl ? 'edit-menu' : undefined}
                        aria-haspopup="true"
                        style={{ cursor: 'pointer' }}
                        onClick={this.handleClick}
                    >
                        <MoreVertIcon />
                    </span>
                    <Menu
                        id="edit-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={() => this.onClickUserEdit(this.props.uid)}>
                            <CreateIcon className={classes.extendedIcon} /><span>编辑资料</span>
                        </MenuItem>
                        <MenuItem onClick={() => this.onClickUserPwd(this.props.uid)}>
                            <DeleteIcon className={classes.extendedIcon} /><span>重置密码</span>
                        </MenuItem>
                    </Menu>
                </Paper>
                <Grid container>
                    {
                        this.props.listLayout ?
                            <Fragment>
                                <Grid item xs={5}>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 180 }}>
                                        {disabled ? <Avatar alt="" src="/imgs/user/default.png" className={classes.avatar} /> : <BlockIcon style={{ fontSize: 84, color: '#D1001E' }} />}
                                        <div style={{ marginTop: 4 }}>
                                            <Switch
                                                checked={!disabled}
                                                style={{ cursor: 'default' }}
                                            />
                                        </div>
                                    </div>
                                </Grid>

                                <Grid item xs={7}>
                                    <List style={{ padding: '16px 0' }}>
                                        <List className={classes.list_user_card}>
                                            <ListItem className={classes.listItem_user_card}>
                                                <MailOutlineIcon style={disabled ? { color: 'black' } : { color: 'gray' }} />
                                                <ListItemText className={classes.listItemText_user_card}><span style={disabled ? { color: 'black' } : { color: 'gray' }}>{this.props.accountName}</span></ListItemText>
                                            </ListItem>
                                        </List>
                                        <List className={classes.list_user_card}>
                                            <ListItem className={classes.listItem_user_card}>
                                                <CardMembershipIcon style={disabled ? { color: 'black' } : { color: 'gray' }} />
                                                <ListItemText className={classes.listItemText_user_card}><span style={disabled ? { color: 'black' } : { color: 'gray' }}>{this.props.title}</span></ListItemText>
                                            </ListItem>
                                        </List>
                                        <List className={classes.list_user_card}>
                                            <ListItem className={classes.listItem_user_card}>
                                                <SettingsPhoneIcon style={disabled ? { color: 'black' } : { color: 'gray' }} />
                                                <ListItemText className={classes.listItemText_user_card}><span style={disabled ? { color: 'black' } : { color: 'gray' }}>{this.props.phone}</span></ListItemText>
                                            </ListItem>
                                        </List>
                                        <List className={classes.list_user_card}>
                                            <ListItem className={classes.listItem_user_card}>
                                                <DateRangeIcon style={disabled ? { color: 'black' } : { color: 'gray' }} />
                                                <ListItemText className={classes.listItemText_user_card}><span style={disabled ? { color: 'black' } : { color: 'gray' }}>{this.props.brithday}</span></ListItemText>
                                            </ListItem>
                                        </List>
                                    </List>
                                </Grid>
                            </Fragment>
                            :
                            <Fragment>
                                <Grid item xs={2}>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 180 }}>
                                        {disabled ? <Avatar alt="" src="/imgs/user/default.png" className={classes.avatar} /> : <BlockIcon style={{ fontSize: 84, color: '#D1001E' }} />}
                                        <div style={{ marginTop: 4 }}>
                                            <Switch
                                                checked={!disabled}
                                                style={{ cursor: 'default' }}
                                            />
                                        </div>
                                    </div>
                                </Grid>

                                <Grid item xs={10}>
                                    <div style={{ display: 'flex' }}>
                                        <List style={{ width: 320, padding: '16px 0' }}>
                                            <List className={classes.list_user_card}>
                                                <ListItem className={classes.listItem_user_card}>
                                                    <MailOutlineIcon style={disabled ? { color: 'black' } : { color: 'gray' }} />
                                                    <ListItemText className={classes.listItemText_user_card}><span style={disabled ? { color: 'black' } : { color: 'gray' }}>{this.props.accountName}</span></ListItemText>
                                                </ListItem>
                                            </List>
                                            <List className={classes.list_user_card}>
                                                <ListItem className={classes.listItem_user_card}>
                                                    <CardMembershipIcon style={disabled ? { color: 'black' } : { color: 'gray' }} />
                                                    <ListItemText className={classes.listItemText_user_card}><span style={disabled ? { color: 'black' } : { color: 'gray' }}>{this.props.title}</span></ListItemText>
                                                </ListItem>
                                            </List>
                                            <List className={classes.list_user_card}>
                                                <ListItem className={classes.listItem_user_card}>
                                                    <SettingsPhoneIcon style={disabled ? { color: 'black' } : { color: 'gray' }} />
                                                    <ListItemText className={classes.listItemText_user_card}><span style={disabled ? { color: 'black' } : { color: 'gray' }}>{this.props.phone}</span></ListItemText>
                                                </ListItem>
                                            </List>
                                            <List className={classes.list_user_card}>
                                                <ListItem className={classes.listItem_user_card}>
                                                    <DateRangeIcon style={disabled ? { color: 'black' } : { color: 'gray' }} />
                                                    <ListItemText className={classes.listItemText_user_card}><span style={disabled ? { color: 'black' } : { color: 'gray' }}>{this.props.brithday}</span></ListItemText>
                                                </ListItem>
                                            </List>
                                        </List>
                                        <List style={{ width: 320, padding: '16px 0' }}>
                                            <List className={classes.list_user_card}>
                                                <ListItem className={classes.listItem_user_card}>
                                                    <BusinessIcon style={disabled ? { color: 'black' } : { color: 'gray' }} />
                                                    <ListItemText className={classes.listItemText_user_card}><span style={disabled ? { color: 'black' } : { color: 'gray' }}>{this.props.department}</span></ListItemText>
                                                </ListItem>
                                            </List>
                                            <List className={classes.list_user_card}>
                                                <ListItem className={classes.listItem_user_card}>
                                                    <PinDropIcon style={disabled ? { color: 'black' } : { color: 'gray' }} />
                                                    <ListItemText className={classes.listItemText_user_card}><span style={disabled ? { color: 'black' } : { color: 'gray' }}>{this.props.address}</span></ListItemText>
                                                </ListItem>
                                            </List>
                                        </List>
                                    </div>
                                </Grid>
                            </Fragment>
                    }
                </Grid>
            </Paper >
        )
    }
}

UserCard.propTypes = {
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
    bar: {
        display: 'flex',
        justifyContent:
            'space-between',
        height: 40,
        backgroundColor: theme.palette.primary.main,
        padding: '8px 20px 8px 20px',
        color: 'white'
    },
    list_user_card: {
        padding: '2px 0',
        marginLeft: -26
    },
    listItem_user_card: {
        paddingTop: 0,
        paddingBottom: 0
    },
    listItemText_user_card: {
        paddingLeft: 4
    },
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    },
    link: {
        textDecoration: 'none',
        color: 'black'
    }
});

export default withStyles(styles)(UserCard);