import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class helper extends Component {
    _isMounted = true;
    constructor(props) {
        super(props)
        this.state = {

        };
    }

    componentWillMount() {
        this.props.onChangeBarTitle('使用帮助')
        this.RefreshInfo()
        this.props.onChangeChildFuncion(this)
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    RefreshInfo() {
        this.props.onChangeRefresh(true)

        this.props.onChangeRefresh(false)
    }

    render() {
        const { classes } = this.props

        return (
            <Fragment>
                <Paper className={classes.actionBar}>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="搜索…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            fullWidth
                        />
                    </div>
                </Paper>
                <div className={classes.root}>

                    <div className={classes.container}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography className={classes.heading}>什么是私有分享？</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Typography>
                                    分享给系统内部成员，只有内部成员才可下载获取.
                                </Typography>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography className={classes.heading}>什么是公有分享？</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Typography>
                                    分享给所有被分享者，通过发送URL地址获取并下载.
                                </Typography>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </div>
                </div>
            </Fragment>
        );
    }
}

helper.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = theme => ({
    root: {
        flex: 1
    },
    container: {
        margin: '20px 0',
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
            cursor: 'pointer'
        },
        marginRight: theme.spacing(1),
        marginLeft: 0,
        padding: theme.spacing(1),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        position: 'absolute',
        marginTop: 5,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        marginLeft: theme.spacing(4),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    }
})

export default withStyles(styles)(helper);