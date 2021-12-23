import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import AuthService from '../../../common/authService'

class moveToFolder extends React.Component {

    constructor(props) {
        super(props)
        this.authService = new AuthService()
        this.state = {
            filePath: '',
            values: null,
            checked: null
        }
    }

    componentDidMount() {
        this.authService.postData('/file/tofolder', null).then((res) => {
            if (res.result) {
                this.setState({ values: res.message })
            }
        })
    }

    onClickSelectFolder = v => () => {
        this.setState({ checked: v })
    };

    render() {
        const { values, checked } = this.state
        const { classes } = this.props

        return (
            <Dialog
                aria-labelledby="customized-dialog-title"
                open={this.props.open}
            >
                <div className={classes.top}>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {'文档移至'}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {'文件夹'}
                    </Typography>
                </div>
                <Divider />
                <List className={classes.list}>
                    {
                        values !== null && values.map((v, i) => (
                            <ListItem key={i} component="div" role={undefined} dense button onClick={this.onClickSelectFolder(v)}>
                                <Checkbox
                                    checked={v === checked}
                                    tabIndex={-1}
                                    disableRipple
                                />
                                <ListItemText primary={v.metadata.location} />
                            </ListItem>
                        ))
                    }
                </List>
                <Divider />
                <div className={classes.bottom}>
                    <Button color="primary" onClick={this.props.onClickConfirmMoveFile(this.state.checked)}>确定</Button>
                    <Button onClick={this.props.onClickCloseMoveFile}>取消</Button>
                </div>
            </Dialog>
        );
    }
}

moveToFolder.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = () => ({
    top: {
        padding: 20,
        width: 540
    },
    bottom: {
        display: 'flex',
        padding: 15
    },
    title: {
        fontSize: 14,
    },
    button: {
        margin: 10
    },
    list: {
        width: '100%',
        padding: 0,
        maxHeight: 300
    },
    listItem: {
        padding: 0
    }
})


export default withStyles(styles)(moveToFolder)
