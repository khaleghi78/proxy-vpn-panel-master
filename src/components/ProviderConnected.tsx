import * as React from 'react';
import {TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination} from '@mui/material';
import {disconnectProviderFn, getAllProviderConnectedFn} from '../config';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import clsx from 'clsx';
import Loading from '../components/Loading';
import {toast} from 'react-toastify';
interface Data {
  ip: string;
  country: string;
  quality: number;
  bandwidth: number;
  latency: number;
  id: string;
  isRegister: boolean;
  providerStatus: string;
  proxyCount: number;
  providerIdentity: string;
}

export default function ProviderConnected() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const queryClient = useQueryClient();
  const {isLoading, data: ConnectedProvider} = useQuery({
    queryKey: ['providerconnected'],
    queryFn: getAllProviderConnectedFn,
  });

  const {mutate: disconnectProvider} = useMutation((providerId: string) => disconnectProviderFn(providerId), {
    onSuccess() {
      queryClient.invalidateQueries('providerconnected');
      toast.success('provider disconnect successfully');
    },
  });

  //function

  const onDisconnectHandler = (providerId: string) => {
    disconnectProvider(providerId);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (isLoading) return <Loading />;
  return (
    <div>
      {ConnectedProvider.data.length === 0 ? null : (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
          <TableContainer sx={{maxHeight: 440}}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  <TableCell>‌Id</TableCell>
                  <TableCell>Quality</TableCell>
                  <TableCell>‌Bandwidth</TableCell>
                  <TableCell>Latency</TableCell>
                  <TableCell>Connected Clients</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ConnectedProvider.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: Data) => {
                  return (
                    <TableRow key={row.id}>
                      <TableCell component='th' scope='row'>
                        {row.providerIdentity}
                      </TableCell>
                      <TableCell>{row.quality.toFixed(2)}</TableCell>
                      <TableCell>{row.bandwidth.toFixed(2)}</TableCell>
                      <TableCell>{row.latency.toFixed(2)}</TableCell>
                      <TableCell>
                        <p className='relative right-10 text-center'>{row.proxyCount}</p>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => onDisconnectHandler(row.id)}
                          className={clsx(
                            row.isRegister ? 'bg-red-500' : ' bg-green-500 ',
                            'rounded px-2 py-1 text-white',
                          )}
                        >
                          {row.isRegister ? 'Disconnect' : 'Connect'}
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={ConnectedProvider.data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </div>
  );
}
