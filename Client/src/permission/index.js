import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import AuthService from '../common/authService'

class Userauth extends React.Component {

    constructor(props) {
        super(props)
        this.authService = new AuthService()
        this.state = {
            open: false,
            noticeMessage: '',
            datas: [],
            role: null,
            selectedIndex: 1,
            check1: false, check2: false, check3: false, check4: false, check5: false, check6: false, check7: false, check8: false, check9: false, check10: false, check11: false, check12: false
        }
    }

    componentDidMount() {
        this.props.onChangeBarTitle('用户授权')
        this.RefreshInfo()
        this.props.onChangeChildFuncion(this)
    }

    RefreshInfo() {
        this.props.onChangeRefresh(true)

        const info = JSON.stringify({
            module: ['_4', '0']
        })

        this.authService.postData('/auth/home', info).then((res) => {
            if (res.result) {
                this.setState({ datas: res.message })
                this.props.onChangeRefresh(false)
            }
            else {
                this.setState({ open: true, noticeMessage: res.message })
                this.props.onChangeRefresh(false)
            }
        })
    }

    onClickNoticeClose = () => {
        this.setState({ open: false });
    };

    onClickUpdateRoleCheck = (v) => {
        this.setState({ [v.target.id]: !Boolean(this.state[v.target.id]) })
    }

    onClickRoleItem = (e) => {
        let role = this.state.datas.filter((v) => {
            return v._id === e
        })[0]
        this.setState({
            role: e,
            check1: (role.permission._1._.split(',')[0] === '1'),
            check2: (role.permission._1._.split(',')[1] === '1'),
            check3: (role.permission._1._.split(',')[2] === '1'),
            check4: (role.permission._1._.split(',')[3] === '1'),
            check5: (role.permission._1._.split(',')[4] === '1'),
            check6: (role.permission._2._.split(',')[0] === '1'),
            check7: (role.permission._2._.split(',')[1] === '1'),
            check8: (role.permission._3._.split(',')[0] === '1'),
            check9: (role.permission._3._.split(',')[1] === '1'),
            check10: (role.permission._4._.split(',')[0] === '1'),
            check11: (role.permission._4._.split(',')[1] === '1'),
            check12: (role.permission._5._.split(',')[0] === '1')
        })
    };

    onClickClearRole = () => {
        this.setState({
            check1: false,
            check2: false,
            check3: false,
            check4: false,
            check5: false,
            check6: false,
            check7: false,
            check8: false,
            check9: false,
            check10: false,
            check11: false,
            check12: false
        })
    }

    onClickUpdateRole = () => {
        if (this.state.role === null) {
            this.setState({ open: true, noticeMessage: '请选择用户角色' })
            return false
        }

        const info = JSON.stringify({
            _id: this.state.role,
            _1: this.state.check1,
            _2: this.state.check2,
            _3: this.state.check3,
            _4: this.state.check4,
            _5: this.state.check5,
            _6: this.state.check6,
            _7: this.state.check7,
            _8: this.state.check8,
            _9: this.state.check9,
            _10: this.state.check10,
            _11: this.state.check11,
            _12: this.state.check12,
            module: ['_4', '1']
        })

        this.authService.postData('/auth/update', info).then((res) => {
            if (res.result) {
                this.setState({ open: true, noticeMessage: res.message })
                this.RefreshInfo()
                this.props.onChangeRefresh(false)
            }
            else {
                this.setState({ open: true, noticeMessage: res.message })
                this.props.onChangeRefresh(false)
            }
        })
    }


    render() {
        const { classes } = this.props
        const { datas, role, check1, check2, check3, check4, check5, check6, check7, check8, check9, check10, check11, check12 } = this.state

        return (
            <Fragment>

                <Grid container spacing={2} className={classes.main}>
                    <Grid item xs={2}>
                        <Paper>
                            <List component="nav">
                                <ListItem style={{ textAlign: 'center' }}>
                                    <ListItemText primary="用户角色" />
                                </ListItem>
                            </List>
                            <Divider />
                            {
                                datas.map((v, i) => {
                                    return <List key={i} component="nav" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                        <ListItem
                                            button
                                            onClick={() => this.onClickRoleItem(v._id)}
                                        >
                                            <ListItemIcon>
                                                <SupervisedUserCircle />
                                            </ListItemIcon>
                                            <ListItemText primary={v.displayName} />
                                        </ListItem>
                                    </List>
                                })
                            }
                        </Paper>
                    </Grid>
                    <Grid item xs={10}>
                        <Paper>
                            <List component="nav">
                                <ListItem style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button variant="contained" color="primary" onClick={this.onClickClearRole}>{'清除'}</Button>
                                    <Button variant="contained" color="primary" onClick={this.onClickUpdateRole}>{'更新'}</Button>
                                </ListItem>
                            </List>
                            <Divider />
                            {
                                role !== null ?
                                    <div className={classNames(classes.rightColumn)}>
                                        <div>
                                            <div style={{ marginTop: 8, color: 'gray', fontSize: 14 }}>个人文档:</div>
                                            <div style={{ padding: '0 15px 10px 15px' }}>
                                                <Checkbox id='check1' checked={check1} value={String(check1)} onChange={(e) => this.onClickUpdateRoleCheck(e)}></Checkbox>
                                                <TextField
                                                    label="查看"
                                                    InputProps={{
                                                        disabled: true,
                                                    }}
                                                    style={{
                                                        marginTop: -10,
                                                        width: 60
                                                    }}
                                                />
                                                <Checkbox id='check2' checked={check2} value={String(check2)} onChange={(e) => this.onClickUpdateRoleCheck(e)}></Checkbox>
                                                <TextField
                                                    label="上传"
                                                    InputProps={{
                                                        disabled: true,
                                                    }}
                                                    style={{
                                                        marginTop: -10,
                                                        width: 60
                                                    }}
                                                />
                                                <Checkbox id='check3' checked={check3} value={String(check3)} onChange={(e) => this.onClickUpdateRoleCheck(e)}></Checkbox>
                                                <TextField
                                                    label="下载"
                                                    InputProps={{
                                                        disabled: true,
                                                    }}
                                                    style={{
                                                        marginTop: -10,
                                                        width: 60
                                                    }}
                                                />
                                                <Checkbox id='check4' checked={check4} value={String(check4)} onChange={(e) => this.onClickUpdateRoleCheck(e)}></Checkbox>
                                                <TextField
                                                    label="删除"
                                                    InputProps={{
                                                        disabled: true,
                                                    }}
                                                    style={{
                                                        marginTop: -10,
                                                        width: 60
                                                    }}
                                                />
                                                <Checkbox id='check5' checked={check5} value={String(check5)} onChange={(e) => this.onClickUpdateRoleCheck(e)}></Checkbox>
                                                <TextField
                                                    label="分享"
                                                    InputProps={{
                                                        disabled: true,
                                                    }}
                                                    style={{
                                                        marginTop: -10,
                                                        width: 60
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ marginTop: 8, color: 'gray', fontSize: 14 }}> 人员信息: </div>
                                            <div style={{ padding: '0 15px 10px 15px' }}>
                                                <Checkbox id='check6' checked={check6} value={String(check6)} onChange={(e) => this.onClickUpdateRoleCheck(e)}></Checkbox >
                                                <TextField
                                                    label="查看"
                                                    InputProps={{
                                                        disabled: true,
                                                    }}
                                                    style={{ marginTop: -10, width: 60 }
                                                    }
                                                />
                                                <Checkbox id='check7' checked={check7} value={String(check7)} onChange={(e) => this.onClickUpdateRoleCheck(e)}></Checkbox >
                                                <TextField
                                                    label="修改"
                                                    InputProps={{
                                                        disabled: true,
                                                    }}
                                                    style={{ marginTop: -10, width: 60 }
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ marginTop: 8, color: 'gray', fontSize: 14 }}>人员角色:</div>
                                            <div style={{ padding: '0 15px 10px 15px' }}>
                                                <Checkbox id='check8' checked={check8} value={String(check8)} onChange={(e) => this.onClickUpdateRoleCheck(e)}></Checkbox>
                                                <TextField
                                                    label="查看"
                                                    value={''}
                                                    onChange={null}
                                                    InputProps={{
                                                        disabled: true,
                                                    }}
                                                    style={{
                                                        marginTop: -10,
                                                        width: 60
                                                    }}
                                                />
                                                <Checkbox id='check9' checked={check9} value={String(check9)} onChange={(e) => this.onClickUpdateRoleCheck(e)}></Checkbox>
                                                <TextField
                                                    label="修改"
                                                    InputProps={{
                                                        disabled: true,
                                                    }}
                                                    style={{
                                                        marginTop: -10,
                                                        width: 60
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ marginTop: 8, color: 'gray', fontSize: 14 }}>用户授权:</div>
                                            <div style={{ padding: '0 15px 10px 15px' }}>
                                                <Checkbox id='check10' checked={check10} value={String(check10)} onChange={(e) => this.onClickUpdateRoleCheck(e)}></Checkbox>
                                                <TextField
                                                    label="查看"
                                                    InputProps={{
                                                        disabled: true,
                                                    }}
                                                    style={{
                                                        marginTop: -10,
                                                        width: 60
                                                    }}
                                                />
                                                <Checkbox id='check11' checked={check11} value={String(check11)} onChange={(e) => this.onClickUpdateRoleCheck(e)}></Checkbox>
                                                <TextField
                                                    label="修改"
                                                    InputProps={{
                                                        disabled: true,
                                                    }}
                                                    style={{
                                                        marginTop: -10,
                                                        width: 60
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ marginTop: 8, color: 'gray', fontSize: 14 }}>系统设置:</div>
                                            <div style={{ padding: '0 15px 10px 15px' }}>
                                                <Checkbox id='check12' checked={check12} value={String(check12)} onChange={(e) => this.onClickUpdateRoleCheck(e)}></Checkbox>
                                                <TextField
                                                    label="完全控制"
                                                    InputProps={{
                                                        disabled: true,
                                                    }}
                                                    style={{
                                                        marginTop: -10,
                                                        width: 90
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div> :
                                    null
                            }
                        </Paper>
                    </Grid >
                </Grid>

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
        );
    }
}

Userauth.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = theme => ({
    main: {
        marginBottom: 10,
    },
    iconsMarginRight: {
        marginRight: theme.spacing(1)
    },
    mainBar: {
        display: 'flex',
        padding: '8px 16px'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    column: {
        flexBasis: '33.33%',
    },
    leftColumn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 200
    },
    rightColumn: {
        padding: '10px 40px'
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: `${theme.spacing(1)}px ${theme.spacing(6)}px`,
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
})


export default withStyles(styles)(Userauth)