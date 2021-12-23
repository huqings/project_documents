import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';

import AuthService from '../../../common/authService'

import { loading } from '../../../common/component'

class selectUser extends React.Component {
    constructor() {
        super();
        this.authService = new AuthService()
        this.state = {
            user: null,
            role: null,
            value: 0,
            selected: [],
            radioGroupValue: 'user',
            selectUserOrRole: '',
            selectRoleOrUser: '',
            progress: false
        }
    }

    componentDidMount() {
        this.authService.postData('/file/selectusers', null).then((res) => {
            if (res.result) {
                this.setState({ user: res.message.user, role: res.message.role })
            }
        })
    }

    onChangeConfirm = () => {

        let info = this.state.selected
        this.props.onClickAddUsersToList(info, true)
        this.setState({ selected: [] })

    }

    onClickCancel = () => {
        this.setState({ selected: [] })
        this.props.onClose();
    };

    onChangeSelected = (s, v, e, l) => {
        let selected = this.state.selected
        let elementHas = selected.find(v => {
            return v.id === s
        })
        if (!elementHas) {
            selected.push({ id: s, displayName: v, other: e, type: l })
        }
        this.setState({ selected })
    }

    onChangeRadioGroup = (e) => {
        this.setState({ radioGroupValue: e.target.value })
    }

    onChangeSelectUserOrRole = (e) => {
        this.setState({ selectUserOrRole: e.target.value })
    }

    onChangeSelectRoleOrUser = (e) => {
        this.setState({ selectRoleOrUser: e.target.value })
    }

    onClickSearchUserOrRole = (e) => {
        this.setState({ progress: true })
        if (e) {
            const info = JSON.stringify({
                value: this.state.selectUserOrRole
            })
            this.authService.postData('/file/selectuserslist', info).then((res) => {
                if (res.result) {
                    this.setState({ user: res.message, progress: false })
                }
            })
        }
        else {
            const info = JSON.stringify({
                value: this.state.selectRoleOrUser
            })
            this.authService.postData('/file/selectroleslist', info).then((res) => {
                if (res.result) {
                    this.setState({ role: res.message, progress: false })
                }
            })
        }
    }

    onClickDelSelected = (e) => {
        let selected = this.state.selected.filter(v => v.id !== e);
        this.setState({ selected })
    }

    render() {
        const { user, role, radioGroupValue, selectUserOrRole, selectRoleOrUser, progress, selected } = this.state
        const { classes } = this.props;

        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                aria-labelledby="confirmation-dialog-title"
                open={this.props.open}
            >
                <DialogTitle style={{ padding: '24px 24px 0px 24px' }}>
                    <RadioGroup aria-label="position" name="position" value={radioGroupValue} onChange={this.onChangeRadioGroup} row>
                        <FormControlLabel
                            value={'user'}
                            control={<Radio color="primary" />}
                            label="用户"
                        />
                        <FormControlLabel
                            value={'role'}
                            control={<Radio color="primary" />}
                            label="角色"
                        />
                    </RadioGroup>
                </DialogTitle>

                {/* <Tabs
                        value={value}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={this.onChangeTabs}
                    >
                        <Tab label="用户" />
                        <Tab label="角色" />
                    </Tabs> 

                    {
                        value === 1 ?
                            <Fragment>
                                <DialogContent style={{ padding: '10px 30px' }}>
                                    <RadioGroup
                                        onChange={this.onChangeSelectRoles}
                                    >
                                        {
                                            this.props.values.roles ? this.props.values.roles.map((v, i) => (
                                                <FormControlLabel
                                                    value={v._id}
                                                    key={i}
                                                    control={<Radio />}
                                                    label={v.displayName}
                                                />
                                            ))
                                                :
                                                null
                                        }
                                    </RadioGroup>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => this.onChangeConfirm(false)} color="primary">确定</Button>
                                    <Button onClick={this.onClickCancel} color="primary">取消</Button>
                                </DialogActions>
                            </Fragment>
                            :
                            value === 0 ?
                                <Fragment>
                                    <DialogContent style={{ padding: 0 }}>
                                        <List>
                                            {
                                                this.props.values.users ? this.props.values.users.map(value => (
                                                    <ListItem key={value._id} style={{ padding: '10px 30px' }}>
                                                        <ListItemText
                                                            primary={`${value.accountName}`}
                                                            secondary={
                                                                <React.Fragment>
                                                                    <Typography component="span" style={{ color: 'grey' }}>
                                                                        {value.displayName}
                                                                    </Typography>
                                                                </React.Fragment>
                                                            }
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <Checkbox
                                                                onChange={this.onChangeSelectUsers(value._id, value.accountName, value.displayName)}
                                                                checked={
                                                                    users.length > 0 ?
                                                                        users.find(x => {
                                                                            return x.accountName === value.accountName
                                                                        }) !== undefined ? true : false
                                                                        :
                                                                        false
                                                                }
                                                            />
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                ))
                                                    : loading

                                            }
                                        </List>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => this.onChangeConfirm(true)} color="primary">确定</Button>
                                        <Button onClick={this.onClickCancel} color="primary">取消</Button>
                                    </DialogActions>
                                </Fragment>
                                :
                                null
                    }
                */}

                <DialogContent className={classes.root}>

                    {
                        radioGroupValue === 'user' ?
                            <TextField
                                label="搜索用户..."
                                fullWidth
                                value={selectUserOrRole}
                                margin="normal"
                                style={{ marginBottom: 16 }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                                helperText="输入姓名或者账户名"
                                onChange={this.onChangeSelectUserOrRole}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title="搜索">
                                                <IconButton
                                                    style={{ marginTop: -16 }}
                                                    onClick={() => this.onClickSearchUserOrRole(true)}
                                                >
                                                    {<SearchIcon />}
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    ),
                                }}
                            /> :
                            <TextField
                                label="搜索角色..."
                                fullWidth
                                value={selectRoleOrUser}
                                margin="normal"
                                style={{ marginBottom: 16 }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                                helperText="输入名称"
                                onChange={this.onChangeSelectRoleOrUser}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title="搜索">
                                                <IconButton
                                                    style={{ marginTop: -16 }}
                                                    onClick={() => this.onClickSearchUserOrRole(false)}
                                                >
                                                    {<SearchIcon />}
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                    }

                    {
                        progress && <LinearProgress style={{ marginBottom: 8 }} />
                    }

                    {
                        radioGroupValue === 'user' && user ? user.map(value => (
                            <Chip
                                key={value._id}
                                variant="outlined"
                                icon={<FaceIcon />}
                                onClick={() => this.onChangeSelected(value._id, value.displayName, value.accountName, true)}
                                className={classes.chip}
                                label={`${value.displayName}(${value.accountName.split('@')[0]})`}
                            />
                        ))
                            : radioGroupValue === 'role' && role ? role.map(value => (
                                <Chip
                                    key={value._id}
                                    variant="outlined"
                                    icon={<SupervisedUserCircleIcon />}
                                    onClick={() => this.onChangeSelected(value._id, value.displayName, value.description, false)}
                                    className={classes.chip}
                                    label={`${value.displayName}`}
                                />
                            ))
                                : loading
                    }
                    <Divider variant="middle" className={classes.divider} />
                    {
                        selected.length > 0 && selected.map(value => {
                            return value.type ? <Chip
                                key={value.id}
                                icon={<FaceIcon />}
                                // onClick={() => this.onChangeSelected(value._id, value.displayName, value.accountName)}
                                className={classes.chip}
                                label={`${value.displayName}`}
                                color="secondary"
                                onDelete={() => this.onClickDelSelected(value.id)}
                            /> : <Chip
                                    key={value.id}
                                    icon={<SupervisedUserCircleIcon />}
                                    // onClick={() => this.onChangeSelected(value._id, value.displayName, value.accountName)}
                                    className={classes.chip}
                                    label={`${value.displayName}`}
                                    color="secondary"
                                    onDelete={() => this.onClickDelSelected(value.id)}
                                />
                        })
                    }
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.onChangeConfirm} color="primary">确定</Button>
                    <Button onClick={this.onClickCancel} color="primary" autoFocus>取消</Button>
                </DialogActions>

            </Dialog>
        );
    }
}

const styles = theme => ({
    root: {
        flex: 1
    },
    chip: {
        margin: theme.spacing(0.5)
    },
    divider: {
        margin: '15px 0'
    }
});

export default withStyles(styles)(selectUser);