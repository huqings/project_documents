import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, BrowserRouter as Router, Link } from 'react-router-dom';
import decode from 'jwt-decode';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import RefreshIcon from '@material-ui/icons/Refresh';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import SideMenu from './common/sideMenu'

import Setup from './setup'
import Dashboard from './dashboard'
import Helper from './helper'
import Download from './download'
import Role from './role'
import Documents from './documents/personal'
import Userauth from './permission'
import Logs from './logs'
import Errorpage from './errorpage'
import Login from './login'
import Share from './documents/share'
import Setting from './setting'
import User from './user'
import UserManage from './user/manage'
import Register from './register'
import UserEdit from './user/edit.js'
import UserAdd from './user/add.js'
import CreateRole from './role/roleadd'
import Password from './user/pwd'
import UserAdds from './user/adds'
import Person from './person'

import Test from './test'

import { LocalStorageKey } from './common/config.js'

const drawerWidth = 180;

class App extends Component {
  constructor(props) {
    super(props);
    // this.onScrollHideBar = this.onScrollHideBar.bind(this);
    this.state = {
      anchorEl: null,
      barTitle: '',
      refresh: false,
      open: true,
      // barHide: false
    }
  }

  // componentDidMount() {
  //   window.addEventListener('scroll', this.onScrollHideBar);
  // };

  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.onScrollHideBar);
  // };

  // onScrollHideBar() {
  //   if (window.scrollY > 60) {
  //     this.setState({ barHide: true })
  //   }
  //   else {
  //     this.setState({ barHide: false })
  //   }
  // }

  loggedIn() {
    const token = localStorage.getItem(LocalStorageKey)
    return !!token && !this.isTokenExpired(JSON.parse(token).t)
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < (Date.now() / 1000)) {
        return true;
      }
      else {
        return false;
      }
    }
    catch (err) {
      return false;
    }
  }

  getToken() {
    return JSON.parse(localStorage.getItem(LocalStorageKey))
  }

  onClickDrawerOpen = () => {
    this.setState({ open: !this.state.open });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleProfileMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogout = () => {
    this.setState({ anchorEl: null });
    localStorage.removeItem(this.state.localStorageKey)
    localStorage.clear()
  }

  onChangeBarTitle = (e) => {
    this.setState({ barTitle: e })
  }

  onChangeRefresh = (e) => {
    this.setState({ refresh: e })
  }

  onChangeChildFuncion = (e) => {
    this.child = e
  }

  onClickRefresh = () => {
    this.child.RefreshInfo()
  }

  render() {
    const { anchorEl, barTitle, open, barHide } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);

    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route
              render={({ location }) => (
                <div
                  className={classes.root}
                >
                  {
                    this.loggedIn()
                      ?
                      <Fragment>

                        <CssBaseline />

                        <AppBar className={barHide ? classes.appBarHide : classes.appBar}>
                          <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <IconButton
                                className={open ? classes.menuButton : classes.menuIconButtonTransform}
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={this.onClickDrawerOpen}
                              >
                                <MenuIcon />
                              </IconButton>
                              <Typography variant="h6" color="inherit" noWrap>
                                {barTitle}
                              </Typography>
                            </div>
                            <Typography noWrap>
                              <img src='/imgs/logo.png' alt='' style={{ height: 55 }} />
                            </Typography>
                            <div className={classes.sectionDesktop}>
                              <IconButton color="inherit" onClick={this.onClickRefresh} >
                                {
                                  this.state.refresh
                                    ?
                                    <CircularProgress size={22} className={classes.progress} />
                                    :
                                    <RefreshIcon />
                                }
                              </IconButton>
                              <IconButton
                                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                                aria-haspopup="true"
                                onClick={this.handleProfileMenuOpen}
                                color="inherit"
                              >
                                <AccountCircle />
                              </IconButton>
                              <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={this.handleProfileMenuClose}
                              >
                                <MenuItem><Link to='/person' style={{ textDecoration: 'none', color: 'black' }} onClick={this.handleProfileMenuClose}>个人资料</Link></MenuItem>
                                <MenuItem onClick={this.handleLogout}>退出系统</MenuItem>
                              </Menu>
                            </div>
                          </Toolbar>
                        </AppBar>

                        <Drawer
                          variant="permanent"
                          classes={{
                            paper: open ? classes.paper : classes.minPaper
                          }}
                          open={open}
                        >
                          <div className={classes.toolbar} />
                          <SideMenu open={open} />
                        </Drawer>

                        <div className={open ? classes.main : classes.minMain}>
                          <div className={classes.toolbar} />
                          <Switch key={location.key}>
                            <Route exact path='/' render={(props) => <Dashboard {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route path='/share' render={(props) => <Share {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route path='/role' render={(props) => <Role {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route path='/user' render={(props) => <User {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route path='/uedit' render={(props) => <UserEdit {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route path='/uadd' render={(props) => <UserAdd {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route path='/uadds' render={(props) => <UserAdds {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route path='/muser' render={(props) => <UserManage {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route path='/pwd' render={(props) => <Password {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route path='/doc' render={(props) => <Documents {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route path='/auth' render={(props) => <Userauth {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route path='/log' render={(props) => <Logs {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route path='/setting' render={(props) => <Setting {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route path='/roleadd' render={(props) => <CreateRole {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route path='/person' render={(props) => <Person {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route path='/helper' render={(props) => <Helper {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />

                              <Route path='/test' render={(props) => <Test {...props} onChangeBarTitle={(e) => this.onChangeBarTitle(e)} onChangeRefresh={(e) => this.onChangeRefresh(e)} onChangeChildFuncion={(e) => this.onChangeChildFuncion(e)} />} />
                              <Route component={Errorpage} />
                          </Switch>
                        </div>

                      </Fragment>
                      :
                      <Fragment>
                        <Switch key={location.key}>
                          <Route exact path='/' render={(props) => <Login {...props} />} />
                          <Route path='/register' render={(props) => <Register {...props} />} />
                          <Route path='/setup' render={(props) => <Setup {...props} />} />
                          <Route path='/download' render={(props) => <Download {...props} />} />
                          <Route component={Login} />
                        </Switch>
                      </Fragment>
                  }
                </div>
              )}
            />
          </Switch>
        </Router>
      </MuiThemeProvider>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
}

const theme = createMuiTheme({
  palette: {
    primary: { main: '#3F51B5' },
    secondary: { main: '#fdb94e', contrastText: '#fff', },
  },
  typography: {
    useNextVariants: true,
  },
});

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    marginTop: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarHide: {
    zIndex: theme.zIndex.drawer + 1,
    marginTop: -64,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  paper: {
    position: 'absolute',
    width: drawerWidth,
    flexShrink: 0,
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    backgroundColor: 'transparent',
    borderRight: 0,
    [theme.breakpoints.down('sm')]: {
      width: 0,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      })
    },
    [theme.breakpoints.up('md')]: {
      width: theme.spacing(9),
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      })
    },
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      })
    },
  },
  minPaper: {
    position: 'absolute',
    flexShrink: 0,
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    backgroundColor: 'transparent',
    borderRight: 0,
    width: theme.spacing(9),
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },
  main: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: 165,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down('md')]: {
      marginLeft: 55,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      })
    },
  },
  minMain: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: 55,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: theme.mixins.toolbar,
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('xs')]: {
      display: 'flex',
    },
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    transform: 'rotate(0deg)',
    transition: '0.5s'
  },
  menuIconButtonTransform: {
    marginLeft: -12,
    marginRight: 20,
    transform: 'rotate(-180deg)',
    transition: '0.5s',
  },
  progress: {
    color: 'white'
  },
});

export default withStyles(styles)(App);