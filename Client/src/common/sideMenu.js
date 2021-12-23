import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AttachFile from '@material-ui/icons/AttachFile';
import Settings from '@material-ui/icons/Settings';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import AccountBox from '@material-ui/icons/AccountBox';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import History from '@material-ui/icons/History';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Stars from '@material-ui/icons/Stars';
import Dashboard from '@material-ui/icons/Dashboard';
import Description from '@material-ui/icons/Description';
import AccountCircle from '@material-ui/icons/AccountCircle';
import BuildIcon from '@material-ui/icons/Build';

import Collapse from '@material-ui/core/Collapse';

import { LocalStorageKey } from './config.js'

class sideMenu extends React.Component {

    state = {
        documentsChecked: false,
        userChecked: false,
        systemChecked: false
    }

    onClickExpansionDocumentsMenu = () => {
        this.setState({ documentsChecked: !this.state.documentsChecked })
    }

    onClickExpansionUserMenu = () => {
        this.setState({ userChecked: !this.state.userChecked })
    }

    onClickExpansionSystemMenu = () => {
        this.setState({ systemChecked: !this.state.systemChecked })
    }

    getToken() {
        return JSON.parse(localStorage.getItem(LocalStorageKey))
    }

    render() {
        const { classes } = this.props;
        const permission = this.getToken().u.p

        return (
            <Fragment>
                <List>
                    <Link to={'/'} style={{ textDecoration: 'none' }}>
                        <ListItem button className={classes.listItem} >
                            <ListItemIcon className={classes.sideListItemIcon}>
                                <Dashboard />
                            </ListItemIcon>
                            <ListItemText className={classes.listItemText} primary={'概览'} />
                        </ListItem>
                    </Link>

                    {
                        permission._1._.indexOf('1') !== -1 ?
                            <Fragment>
                                <ListItem button className={classes.listItem} onClick={this.onClickExpansionDocumentsMenu}>
                                    <ListItemIcon className={classes.sideListItemIcon}>
                                        {this.state.documentsChecked ? <KeyboardArrowDown /> : <AttachFile />}
                                    </ListItemIcon>
                                    <ListItemText className={classes.listItemText} primary={'个人文档'} />
                                </ListItem>
                                <Collapse in={this.state.documentsChecked}>
                                    <Link to={'/doc'} style={{ textDecoration: 'none' }}>
                                        <ListItem button className={this.props.open ? classes.sideWidth : classes.minSideWidth}>
                                            <ListItemIcon className={classes.sideListItemIcon}>
                                                <Description />
                                            </ListItemIcon>
                                            <ListItemText className={classes.listItemText} primary={'我的文档'} />
                                        </ListItem>
                                    </Link>
                                    <Link to={'/share'} style={{ textDecoration: 'none' }}>
                                        <ListItem button className={this.props.open ? classes.sideWidth : classes.minSideWidth}>
                                            <ListItemIcon className={classes.sideListItemIcon}>
                                                <Stars />
                                            </ListItemIcon>
                                            <ListItemText className={classes.listItemText} primary={'分享文档'} />
                                        </ListItem>
                                    </Link>
                                    <Divider />
                                </Collapse>
                            </Fragment>
                            :
                            null
                    }

                    {
                        permission._2._.indexOf('1') !== -1 ?
                            <Fragment>
                                <ListItem button className={classes.listItem} onClick={this.onClickExpansionUserMenu}>
                                    <ListItemIcon className={classes.sideListItemIcon}>
                                        {this.state.userChecked ? <KeyboardArrowDown /> : <SupervisorAccount />}
                                    </ListItemIcon>
                                    <ListItemText className={classes.listItemText} primary={'人员信息'} />
                                </ListItem>
                                <Collapse in={this.state.userChecked}>
                                    <Link to={'/user'} style={{ textDecoration: 'none' }}>
                                        <ListItem button className={this.props.open ? classes.sideWidth : classes.minSideWidth}>
                                            <ListItemIcon className={classes.sideListItemIcon}>
                                                <AccountBox />
                                            </ListItemIcon>
                                            <ListItemText className={classes.listItemText} primary={'人员列表'} />
                                        </ListItem>
                                    </Link>
                                    {
                                        permission._2._.split(',')[1].indexOf('1') !== -1 ?
                                            <Link to={'/muser'} style={{ textDecoration: 'none' }}>
                                                <ListItem button className={this.props.open ? classes.sideWidth : classes.minSideWidth}>
                                                    <ListItemIcon className={classes.sideListItemIcon}>
                                                        <AccountCircle />
                                                    </ListItemIcon>
                                                    <ListItemText className={classes.listItemText} primary={'设置人员'} />
                                                </ListItem>
                                            </Link>
                                            :
                                            null
                                    }
                                    <Divider />
                                </Collapse>
                            </Fragment>
                            :
                            null
                    }

                    {
                        permission._3._.indexOf('1') !== -1 ?
                            <Link to={'/role'} style={{ textDecoration: 'none' }}>
                                <ListItem button className={classes.listItem} >
                                    <ListItemIcon className={classes.sideListItemIcon}>
                                        <SupervisedUserCircle />
                                    </ListItemIcon>
                                    <ListItemText className={classes.listItemText} primary={'人员角色'} />
                                </ListItem>
                            </Link>
                            :
                            null
                    }

                    {
                        permission._4._.indexOf('1') !== -1 ?
                            <Link to={'/auth'} style={{ textDecoration: 'none' }}>
                                <ListItem button className={classes.listItem} >
                                    <ListItemIcon className={classes.sideListItemIcon}>
                                        <VerifiedUser />
                                    </ListItemIcon>
                                    <ListItemText className={classes.listItemText} primary={'用户授权'} />
                                </ListItem>
                            </Link>
                            :
                            null
                    }

                    {
                        permission._5._.indexOf('1') !== -1 ?
                            <Fragment>
                                <ListItem button className={classes.listItem} onClick={this.onClickExpansionSystemMenu}>
                                    <ListItemIcon className={classes.sideListItemIcon}>
                                        {this.state.systemChecked ? <KeyboardArrowDown /> : <Settings />}
                                    </ListItemIcon>
                                    <ListItemText className={classes.listItemText} primary={'设置'} />
                                </ListItem>

                                <Collapse in={this.state.systemChecked}>
                                    <Link to={'/setting'} style={{ textDecoration: 'none' }}>
                                        <ListItem button className={this.props.open ? classes.sideWidth : classes.minSideWidth}>
                                            <ListItemIcon className={classes.sideListItemIcon}>
                                                <BuildIcon />
                                            </ListItemIcon>
                                            <ListItemText className={classes.listItemText} primary={'系统设置'} />
                                        </ListItem>
                                    </Link>
                                    <Link to={'/log'} style={{ textDecoration: 'none' }}>
                                        <ListItem button className={this.props.open ? classes.sideWidth : classes.minSideWidth}>
                                            <ListItemIcon className={classes.sideListItemIcon}>
                                                <History />
                                            </ListItemIcon>
                                            <ListItemText className={classes.listItemText} primary={'系统日志'} />
                                        </ListItem>
                                    </Link>
                                </Collapse>
                            </Fragment>
                            :
                            null
                    }
                </List>
            </Fragment >
        );
    }
}

const styles = theme => ({
    listItem: {
        marginLeft: 0
    },
    listItemText: {
        padding: '0',
        color: 'black'
    },
    sideListItemIcon: {
        marginLeft: 8
    },
    sideWidth: {
        paddingLeft: 40,
        transition: theme.transitions.create('padding', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        [theme.breakpoints.down('md')]: {
            paddingLeft: 16,
            transition: theme.transitions.create('padding', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            })
        },
    },
    minSideWidth: {
        paddingLeft: 16,
        transition: theme.transitions.create('padding', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        })
    }
})

sideMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(sideMenu);