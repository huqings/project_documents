import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

export default class TableHeader extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { order, orderBy } = this.props;
        return (
            <TableHead>
                <TableRow>
                    <TableCell style={{ width: '5%', padding: 10 }}></TableCell>
                    <TableCell sortDirection={orderBy === 'filename' ? order : false} style={{ padding: '0px 10px 0px 0px' }}>
                        <Tooltip
                            title="文件名"
                            placement={true ? 'bottom-end' : 'bottom-start'}
                            enterDelay={300}
                        >
                            <TableSortLabel
                                active={orderBy === 'filename'}
                                direction={order}
                                onClick={this.createSortHandler('filename')}
                            >
                                文件名
                            </TableSortLabel>
                        </Tooltip>
                    </TableCell>
                    <TableCell style={{ width: '5%', padding: 10 }} align='right'>
                        类型
                    </TableCell>
                    <TableCell sortDirection={orderBy === 'uploadDate' ? order : false} style={{ width: '12%', padding: '0px 10px 0px 0px' }} align='right'>
                        <Tooltip
                            title="时间"
                            placement={true ? 'bottom-end' : 'bottom-start'}
                            enterDelay={300}
                        >
                            <TableSortLabel
                                active={orderBy === 'uploadDate'}
                                direction={order}
                                onClick={this.createSortHandler('uploadDate')}
                            >
                                时间
                            </TableSortLabel>
                        </Tooltip>
                    </TableCell>
                    <TableCell style={{ width: '10%', padding: 10 }} align='center'>大小</TableCell>
                </TableRow>
            </TableHead>
        );
    }
}