import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import AuthService from '../common/authService';
import Loading from '../common/loading'
import { LocalStorageKey } from '../common/config'

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(5),
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    infoBar: {
        padding: theme.spacing(2),
    }
});

class logs extends Component {
    _isMounted = true

    constructor(props) {
        super(props)
        this.authService = new AuthService()
        this.state = {
            datas: null
        }
    }

    componentDidMount() {
        this.props.onChangeBarTitle('系统日志')
        this.RefreshInfo()
        this.props.onChangeChildFuncion(this)
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    RefreshInfo() {
        this.props.onChangeRefresh(true)

        this.authService.postData('/setting/log', null).then((res) => {
            if (this._isMounted) {
                if (res.result) {
                    this.setState({ datas: res.message })
                    this.props.onChangeRefresh(false)
                }
            }
        })
    }

    getToken() {
        return JSON.parse(localStorage.getItem(LocalStorageKey))
    }

    render() {
        const { classes } = this.props;
        const { datas } = this.state;
        return (
            <Fragment>
                <Paper className={classes.infoBar}>
                    <Typography variant="h5" component="h3">
                        系统日志
                    </Typography>
                    <Typography component="p">
                        记录系统登录、操作等相关信息
                    </Typography>
                </Paper>
                <Paper className={classes.root}>
                    {datas !== null ?
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ width: '20%' }}>账号</TableCell>
                                    <TableCell style={{ width: '15%' }} align="right">操作模块</TableCell>
                                    <TableCell >操作详情</TableCell>
                                    <TableCell align="right">操作时间</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    datas.map(row => (
                                        <TableRow key={row._id}>
                                            <TableCell component="th" scope="row"> {row.accountName} </TableCell>
                                            <TableCell align="right">{row.actionModule}</TableCell>
                                            <TableCell>{row.actionDetails}</TableCell>
                                            <TableCell align="right">{row.actionTime}</TableCell>
                                        </TableRow>
                                    ))

                                }
                            </TableBody>
                        </Table>
                        :
                        <Loading number={[0, 1, 2, 3, 4]} />
                    }
                </Paper>
            </Fragment>
        )
    }
}

logs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(logs);