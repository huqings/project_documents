import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

const styles = theme => ({
    fake: {
        height: theme.spacing(1),
        margin: theme.spacing(2),
        '&:nth-child(2n)': {
            marginRight: theme.spacing(4),
        },
    },
});

class loading extends React.Component {

    render() {
        const { classes } = this.props;

        return (
            this.props.number.map(v => (
                <div
                    key={v}
                    style={{
                        backgroundColor: grey[200]
                    }}
                    className={classes.fake}
                />
            ))
        )
    }
}

loading.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(loading);