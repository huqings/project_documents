import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
    },
    main: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        width: '100%'
    }
});

function errorpage(props) {
    const { classes } = props;

    return (
        <div className={classes.root} >
            <Paper className={classes.main} elevation={1}>
                <Typography variant="h5" component="h3">
                    404 页面
                </Typography>
                <Typography component="p">
                    你访问的页面不存在。
                </Typography>
            </Paper>
        </div>
    );
}

errorpage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(errorpage);