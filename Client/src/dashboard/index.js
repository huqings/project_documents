import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import StarsIcon from '@material-ui/icons/Stars';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AssessmentIcon from '@material-ui/icons/Assessment';

import AuthService from '../common/authService'
import Loading from '../common/loading'

const title = '企业文档分享'

class Dashboard extends Component {
    _isMounted = true;
    constructor(props) {
        super(props)
        this.authService = new AuthService()
        this.state = {
            acount: 0,
            scount: 0,
            userTop5: [],
            userTop10: []
        };
    }

    componentWillMount() {
        this.props.onChangeBarTitle('概览')
        this.RefreshInfo()
        this.props.onChangeChildFuncion(this)
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    RefreshInfo() {
        this.props.onChangeRefresh(true)
        this.setState({
            userTop5: [],
            userTop10: []
        })
        const info = JSON.stringify({
            module: ['_1', '0']
        })
        this.authService.postData('/dashboard', info).then(res => {
            if (this._isMounted) {
                this.setState(res.message)
                this.props.onChangeRefresh(false)
            }
        })
    }

    onClickNavDoc = () => {
        this.props.history.push(`/doc`)
    }

    onClickNavHelper = () => {
        this.props.history.push(`/helper`)
    }

    render() {
        const { classes } = this.props
        const { acount, scount, userTop5, userTop10 } = this.state;

        let list = (length) => {
            var res = [];
            for (var i = 0; i < length + 1; i++) {
                res.push(<StarsIcon key={i} />)
            }
            return res
        }

        return (
            <Fragment>
                <Grid container className={classes.root} spacing={1}>
                    <Grid item xs={3}>
                        <Card className={classes.card}>
                            {
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <Button variant="contained" size="large" className={classes.dashBtnIcon} style={{ backgroundColor: '#1287DE', width: 100 }}>
                                        <FileCopyIcon style={{ color: 'white' }} fontSize={'large'} />
                                    </Button>
                                    <div style={{ padding: 10, marginLeft: 10 }}>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>文档库数量</Typography>
                                        <Typography variant="h5" component="h2">{acount}</Typography>
                                        <Typography color="textSecondary">{new Date().toDateString()}</Typography>
                                    </div>
                                </div>
                            }
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card className={classes.card}>
                            {
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <Button variant="contained" size="large" className={classes.dashBtnIcon} style={{ backgroundColor: '#FD8508', width: 100 }}><ShareIcon style={{ color: 'white' }} fontSize={'large'} /></Button>
                                    <div style={{ padding: 10, marginLeft: 10 }}>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>已分享数量</Typography>
                                        <Typography variant="h5" component="h2">{scount}</Typography>
                                        <Typography color="textSecondary">{new Date().toDateString()}</Typography>
                                    </div>
                                </div>
                            }
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card className={classes.card}>
                            {
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <Button variant="contained" size="large" className={classes.dashBtnIcon} style={{ backgroundColor: '#EE2B2A', width: 100 }}>
                                        <AssessmentIcon style={{ color: 'white' }} fontSize={'large'} />
                                    </Button>
                                    <div style={{ padding: 10, marginLeft: 10 }}>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>文档排行榜</Typography>
                                        <Typography variant="h5" component="h2">Top 5</Typography>
                                        <Typography color="textSecondary">{new Date().toDateString()}</Typography>
                                    </div>
                                </div>
                            }
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card className={classes.card}>
                            {
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <Button variant="contained" size="large" className={classes.dashBtnIcon} style={{ backgroundColor: '#40A33F', width: 100 }}>
                                        <AccountBalanceIcon style={{ color: 'white' }} fontSize={'large'} />
                                    </Button>
                                    <div style={{ padding: 10, marginLeft: 10 }}>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>分享排行榜</Typography>
                                        <Typography variant="h5" component="h2">Top 10</Typography>
                                        <Typography color="textSecondary">{new Date().toDateString()}</Typography>
                                    </div>
                                </div>
                            }
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Card>
                                    <CardMedia
                                        className={classes.media}
                                        image="/imgs/card/beard.jpeg"
                                        title={title}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {title}
                                        </Typography>
                                        <Typography component="p">
                                            {'基于知识分享理念而设计的文档管理分享与平台，解决文档分散、文档传递不可控等根本原因，帮助企业构建集中的海量文档管理平台，对文档进行全生命周期管理。'}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary" onClick={this.onClickNavDoc}>
                                            {'开启文档'}
                                        </Button>
                                        <Button size="small" color="primary" onClick={this.onClickNavHelper}>
                                            {'使用帮助'}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Paper>
                                            <List>
                                                {
                                                    userTop5.length > 0 ?
                                                        userTop5.map((v, i) => {
                                                            return (<ListItem key={i}>
                                                                <Avatar style={{ marginRight: 8 }}>
                                                                    <AssignmentIndIcon />
                                                                </Avatar>
                                                                <ListItemText
                                                                    primary={`${v.displayName}`}
                                                                    secondary={
                                                                        <React.Fragment>
                                                                            <Typography component="span" className={classes.inline} color="textPrimary">
                                                                                {v.accountName}
                                                                                <br />
                                                                                {
                                                                                    list(4 - i)
                                                                                }
                                                                            </Typography>
                                                                        </React.Fragment>
                                                                    }
                                                                />
                                                            </ListItem>)
                                                        })
                                                        :
                                                        <Loading number={[0, 1, 2, 3, 4]} />
                                                }
                                            </List>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper>
                                            <List>
                                                {
                                                    userTop10.length > 0 ?
                                                        userTop10.map((v, i) => {
                                                            return (<ListItem key={i}>
                                                                <Avatar style={{ marginRight: 8 }}>
                                                                    <AssignmentIndIcon />
                                                                </Avatar>
                                                                <ListItemText
                                                                    primary={v.displayName}
                                                                    secondary={
                                                                        <React.Fragment>
                                                                            <Typography component="span" className={classes.inline} color="textPrimary">
                                                                                {v.accountName}
                                                                            </Typography>
                                                                        </React.Fragment>
                                                                    }
                                                                />
                                                            </ListItem>)
                                                        })
                                                        :
                                                        <Loading number={[0, 1, 2, 3, 4]} />
                                                }
                                            </List>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Fragment>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = {
    root: {
        flexGrow: 1
    },
    card: {
        minWidth: 120,
        marginBottom: 8
    },
    title: {
        fontSize: 14,
    },
    media: {
        height: 360,
    },
    inline: {
        display: 'inline',
    },
};

export default withStyles(styles)(Dashboard);