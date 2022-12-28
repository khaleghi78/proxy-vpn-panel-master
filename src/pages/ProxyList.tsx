import StarOutlineIcon from '@mui/icons-material/StarOutline';
import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import {useMutation} from 'react-query';
import {toast} from 'react-toastify';
import Loading from '../components/Loading';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@mui/material';
import {AddFavouritefn, AddTodayfn, api} from '../config';

interface Proxy {
  listenPort: number;
  listenAddr: string;
  status: number;
  id: string;
  outgoingCountry: string;
  identityId: string;
  userIdentity: string;
}

const ProxyList = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [note, setNote] = React.useState('');
  const [data, setData] = React.useState<any>([]);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getProxy = async () => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    try {
      const response = await api.get<any>(`/users/${id}/proxy`, {headers: {Authorization: `Bearer ${token}`}});
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(true);
    }
  };

  React.useEffect(() => {
    getProxy();
  }, []);

  const {mutate: AddtoFavourite} = useMutation((favourite: any) => AddFavouritefn(favourite), {
    onSuccess: () => {
      toast.success('The proxy added to your favourite list successfully');
      (document.getElementById('noteId') as HTMLInputElement).value = '';
    },
    onError: (error: any) => {
      toast.error(`Something went wrong: ${error.response.data.message}`);
    },
  });

  const {mutate: AddtoToday} = useMutation((today: any) => AddTodayfn(today), {
    onSuccess: () => {
      toast.success('The proxy added to your today list successfully');
      let inputs = document.getElementById('checkId') as HTMLInputElement;
      inputs.checked = false;
      (document.getElementById('noteId') as HTMLInputElement).value = '';
    },
    onError: (error: any) => {
      toast.error(`Something went wrong: ${error.response.data.message}`);
    },
  });

  const onSubmitHandler = (id: any) => {
    if (note === '') {
      const kind = 'favorite';
      const bulk = [
        {
          proxyId: id,
        },
      ];
      const favourite = {bulk, kind};
      AddtoFavourite(favourite);
    } else {
      const kind = 'favorite';
      const bulk = [
        {
          proxyId: id,
          note,
        },
      ];
      const favourite = {bulk, kind};
      AddtoFavourite(favourite);
    }
  };

  const onTodayHandler = (id: any) => {
    if (note === '') {
      const kind = 'today';
      const bulk = [
        {
          proxyId: id,
        },
      ];
      const today = {bulk, kind};
      AddtoToday(today);
    } else {
      const kind = 'today';
      const bulk = [
        {
          proxyId: id,
          note,
        },
      ];
      const today = {bulk, kind};
      AddtoToday(today);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      {data?.data ? (
        <div>
          <p className='my-3 w-24 rounded bg-[#111627] p-2 text-center text-white'>Proxy List</p>

          <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label='simple table'>
              <TableHead className='tableHead'>
                <TableRow>
                  <TableCell>‌Local Id</TableCell>
                  <TableCell>‌IP:Port</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='tableBody'>
                {data.data.map((row: Proxy) => (
                  <TableRow key={row.id} className='tableRow'>
                    <TableCell className='text-xs' component='th' scope='row'>
                      {row.userIdentity}
                    </TableCell>
                    <TableCell>
                      {row.listenAddr}:{row.listenPort}
                    </TableCell>
                    <TableCell>
                      <ReactCountryFlag className='relative left-5 text-2xl' countryCode={row.outgoingCountry} svg />
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        {(() => {
                          if (row.status === 1) {
                            return <button className='rounded-md bg-red-500  py-1 px-2 text-white'>offline</button>;
                          } else if (row.status === 2) {
                            return <button className='rounded-md bg-green-500 py-1 px-2 text-white'>online</button>;
                          } else {
                            <button className='rounded-md bg-black  py-1 px-2 text-white'>disabled</button>;
                          }
                        })()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <StarOutlineIcon
                          onClick={() => onSubmitHandler(row.id)}
                          className='cursor-pointer text-gray-500 '
                        />
                        <input
                          id='checkId'
                          onClick={() => onTodayHandler(row.id)}
                          type='checkbox'
                          className='h-4 w-4 text-black'
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <input
                        id='noteId'
                        type='text'
                        className='border-blue-[#F3F4F6] border bg-gray-100 placeholder:pl-2 placeholder:text-xs'
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component='div'
              count={100}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      ) : (
        <p className='flex items-center justify-center text-2xl font-bold'>{error && 'Something went wrong'}</p>
      )}
    </div>
  );
};

export default ProxyList;
