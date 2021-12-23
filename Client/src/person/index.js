import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { LocalStorageKey } from '../common/config.js'
import AuthService from '../common/authService'

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.authService = new AuthService()
        this.state = {
            department: '',
            title: '',
            level: ''
        }
    }

    componentDidMount() {
        this.props.onChangeBarTitle('个人资料')
        this.RefreshInfo()
        this.props.onChangeChildFuncion(this)
    }

    RefreshInfo() {
        this.props.onChangeRefresh(true)

        let info = JSON.stringify({
            _id: unescape(this.getToken().u.i)
        })

        this.authService.postData('/person/home', info).then(res => {
            if (res.result) {
                this.setState({
                    department: res.message.department,
                    title: res.message.title,
                    level: res.message.level
                })
            }
            this.props.onChangeRefresh(false)
        })
    }

    getToken() {
        return JSON.parse(localStorage.getItem(LocalStorageKey))
    }

    render() {
        const { classes } = this.props
        const { department, title, level } = this.state

        return (
            <Fragment>
                <Grid container className={classes.root}>
                    <Grid item xs={12}>
                        <Card>
                            <CardMedia
                                className={classes.media}
                                image="/imgs/card/post-1.png"
                                title="个人资料背景"
                            >
                                <Grid container className={classes.media} justify='center' direction="column" alignItems="center">
                                    <Avatar alt="" style={{ height: 120, width: 120 }} src="/imgs/user/default.png" />
                                    <Typography variant="h5" style={{ marginTop: 12, color: 'white' }}>{unescape(this.getToken().u.d)}</Typography>
                                    <Grid>
                                        <Button variant="contained" className={classes.button}>
                                            {department}
                                        </Button>
                                        <Button variant="contained" className={classes.button}>
                                            {title}
                                        </Button>
                                        <Button variant="contained" className={classes.button}>
                                            等级{level}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardMedia>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>

                                </Typography>
                                <Typography variant="h5" component="h2">
                                    个人简介
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    这家伙真懒,什么也没有留下
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">更多信息</Button>
                            </CardActions>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>

                    </Grid>
                </Grid>
            </Fragment>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    media: {
        height: 333
    },
    button: {
        margin: theme.spacing(1),
    },
})

export default withStyles(styles)(Dashboard);