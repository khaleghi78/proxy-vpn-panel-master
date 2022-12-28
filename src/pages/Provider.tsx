import clsx from 'clsx';
import * as React from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {toast} from 'react-toastify';
import Loading from '../components/Loading';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@mui/material';
import ProviderConnected from '../components/ProviderConnected';
import {api, connectProviderFn, disconnectProviderFn, getAllProviderConnectedFn} from '../config';
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

export default function Provider() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const queryClient = useQueryClient();

  const getAllProviderFn = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get(
        '/provider/myst?filters[country]=GB&filters[providerIpType]=residential&limit=500',
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getAllProviderFn();
  }, []);

  const {data: ConnectedProvider} = useQuery({
    queryKey: ['providerconnected'],
    queryFn: getAllProviderConnectedFn,
  });

  const {mutate: disconnectProvider} = useMutation((providerId: string) => disconnectProviderFn(providerId), {
    onSuccess() {
      getAllProviderFn();
      toast.success('Provider disconnected successfully');
      queryClient.invalidateQueries('providerconnected');
    },
  });

  const {
    mutate: connectProvider,
    isLoading,
    error,
  } = useMutation((providerId: string) => connectProviderFn(providerId), {
    onSuccess: () => {
      queryClient.invalidateQueries('providerconnected');
      toast.success('Provider created successfully');
    },
    onError: (error: any) => {
      toast.error(`Something went wrong: ${error.response.data.message}`);
    },
  });

  //function

  const onDisconnectHandler = (providerId: string) => {
    disconnectProvider(providerId);
  };

  const onConnectHandler = (providerId: string) => {
    connectProvider(providerId);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) return <Loading />;
  return (
    <div>
      <p className='my-3 w-40 rounded bg-[#111627] p-2 text-center text-white'>Provider List</p>

      <Paper sx={{width: '100%', overflow: 'hidden'}}>
        <TableContainer sx={{maxHeight: 440}}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <TableCell>‌Id</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Quality</TableCell>
                <TableCell>‌Bandwidth</TableCell>
                <TableCell>Latency</TableCell>
                <TableCell>Connected clients</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: Data) => {
                return (
                  <TableRow key={row.id} className='tableRow'>
                    <TableCell className='text-xs' component='th' scope='row'>
                      {row.providerIdentity}
                    </TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>{row.quality.toFixed(2)}</TableCell>
                    <TableCell>{row.bandwidth.toFixed(2)}</TableCell>
                    <TableCell>{row.latency.toFixed(2)}</TableCell>
                    <TableCell className='px-0'>
                      <p className='relative right-10 text-center'>{row.proxyCount}</p>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => onConnectHandler(row.id)}
                        className={clsx(
                          row.isRegister ? 'bg-red-500' : ' bg-green-500 ',
                          'cursor-pointer rounded px-2 py-1 text-white',
                        )}
                      >
                        {isLoading ? (
                          <svg
                            className='mr-2 inline h-4 w-4 animate-spin fill-blue-200 text-gray-200'
                            viewBox='0 0 100 101'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                              fill='currentColor'
                            />
                            <path
                              d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                              fill='currentFill'
                            />
                          </svg>
                        ) : null}
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
          rowsPerPageOptions={[10, 25, 100, 500, 1000]}
          component='div'
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <p className='my-3 w-40 rounded bg-[#111627] p-2 text-center text-white'>Connected Provider</p>

      <ProviderConnected />
    </div>
  );
}
