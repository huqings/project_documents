import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';
import AuthService from '../../common/authService';
import TableHeader from './TableHeader'

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

class DocFrom extends React.Component {
    _isMounted = true;
    constructor(props) {
        super(props)
        this.authService = new AuthService()
        this.state = {
            order: 'asc',
            orderBy: 'calories',
            selected: [],
            data: [],
            page: 0,
            rowsPerPage: 10,
            loading: false,
            open: false,
            noticeMessage: null,
            toolBar: false
        };
    }

    componentWillMount() {
        this.RefreshInfo()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    RefreshInfo = () => {
        this.props.onChangeRefresh(true)
        this.authService.postData('/file/sharefromlist', null).then((res) => {
            if (this._isMounted) {
                if (res.result) {
                    this.setState({ data: res.message })
                } else {
                    this.setState({ data: [], open: true, noticeMessage: res.message })
                }
                this.props.onChangeRefresh(false)
            }
        })
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({ selected: state.data.map(n => n._id) }));
            return;
        }
        this.setState({ selected: [] });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    onClickNoticeClose = () => {
        this.setState({ open: false });
    };

    onClickDownloadFile = (id) => {
        const a = document.createElement('a')
        a.setAttribute('href', this.authService.downloadFile('/file/down', id))
        a.click()
    }

    isSelected = (id) => {
        return this.state.selected.indexOf(id) !== -1;
    }

    render() {
        const { classes } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page, open, noticeMessage } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <Fragment>
                <div className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table} aria-labelledby="tableTitle">
                            <TableHeader
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={this.handleRequestSort}
                                rowCount={data.length}
                            />
                            <TableBody>
                                {stableSort(data, getSorting(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(n => {
                                        const isSelected = this.isSelected(n._id);
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={n._id}
                                                selected={isSelected}
                                                style={n.metadata.status === 1 ? { borderLeft: '8px solid rgb(76, 175, 80)' } : { borderLeft: '8px solid rgb(255, 152, 0)' }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Button size="small" onClick={() => this.onClickDownloadFile(n._id)}>
                                                        下载
                                                    </Button>
                                                </TableCell>
                                                <TableCell component="th" scope="row" padding="none">
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <img src={`/imgs/type/${n.metadata.typename}.png`} alt='' className={classes.img} />
                                                        {n.metadata.filename}
                                                    </div>
                                                </TableCell>
                                                <TableCell className={classes.tableCell} align="right">{n.metadata.typename}</TableCell>
                                                <TableCell className={classes.tableCell} align="right">{n.uploadDate.split('T')[0]}</TableCell>
                                                <TableCell className={classes.tableCell} align="right">{n.metadata.userDisplayName}</TableCell>
                                                <TableCell className={classes.tableCell} align="center">{((n.length / 1024) / 1024).toFixed(3)}MB</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 49 * emptyRows }}>
                                        <TableCell colSpan={7} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination
                        rowsPerPageOptions={[10, 15, 25]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            'aria-label': '上一页',
                        }}
                        nextIconButtonProps={{
                            'aria-label': '下一页',
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        labelRowsPerPage={'每页'}
                    />
                </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={open}
                    onClose={this.onClickNoticeClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                >
                    <SnackbarContent
                        aria-describedby="client-snackbar"
                        message={
                            <span style={{ display: 'flex', alignItems: 'center', }}>
                                {noticeMessage}
                            </span>
                        }
                    />
                </Snackbar>
            </Fragment>
        )
    }
}

DocFrom.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = theme => ({
    root: {
        width: '100%'
    },
    button: {
        marginRight: `${theme.spacing(1)}px`,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    progress: {
        margin: theme.spacing(2),
    },
    img: {
        marginRight: 8,
        height: 20
    },
    chip: {
        margin: theme.spacing(1),
    },
    tableCell: {
        padding: '0px 10px'
    },
});

export default withStyles(styles)(DocFrom);