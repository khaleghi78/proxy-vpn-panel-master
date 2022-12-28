import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {toast} from 'react-toastify';
import Loading from '../components/Loading';
import {TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination} from '@mui/material';
import {DeleteFavouritefn, getAllFavouriteFn} from '../config';

interface Proxy {
  id: string;
  proxy: {
    listenPort: number;
    listenAddr: string;
    status: number;
    id: string;
    outgoingCountry: string;
    identityId: string;
    userIdentity: string;
  };
  note: string;
}

function FavouriteList() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const queryClient = useQueryClient();

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const {isLoading, data, error} = useQuery({
    queryKey: ['favourite'],
    queryFn: getAllFavouriteFn,
  });

  const {mutate: removeFavourite, isLoading: addLoading} = useMutation(
    (identityId: any) => DeleteFavouritefn(identityId),
    {
      onSuccess(data) {
        queryClient.invalidateQueries('favourite');
        toast.success('Proxy removed successfully');
      },
      onError: (error: any) => {
        toast.error(`Something went wrong: ${error.response.data.message}`);
      },
    },
  );

  const onDeleteHandler = (identityId: any) => {
    removeFavourite(identityId);
  };

  if (isLoading) return <Loading />;

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
                  <TableCell>Note</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='tableBody'>
                {data.data.map((row: Proxy) => (
                  <TableRow key={row.proxy.id} className='tableRow'>
                    <TableCell className='text-xs' component='th' scope='row'>
                      {row.proxy.userIdentity}
                    </TableCell>
                    <TableCell>
                      {row.proxy.listenAddr}:{row.proxy.listenPort}
                    </TableCell>
                    <TableCell>
                      <ReactCountryFlag
                        className='relative left-5 text-2xl'
                        countryCode={row.proxy.outgoingCountry}
                        svg
                      />
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        {(() => {
                          if (row.proxy.status === 1) {
                            return <button className='rounded-md bg-red-500  py-1 px-2 text-white'>offline</button>;
                          } else if (row.proxy.status === 2) {
                            return <button className='rounded-md bg-green-500 py-1 px-2 text-white'>online</button>;
                          } else {
                            <button className='rounded-md bg-black  py-1 px-2 text-white'>disabled</button>;
                          }
                        })()}
                      </div>
                    </TableCell>
                    <TableCell>{row?.note || 'There is no note for this proxy'}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => onDeleteHandler(row.id)}
                        className='rounded-md bg-red-600 p-2 font-bold text-white'
                      >
                        Remove From Favourite
                      </button>
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
        <p className='flex items-center justify-center text-2xl font-bold'>
          {error instanceof Error && 'Something went wrong'}
        </p>
      )}
    </div>
  );
}

export default FavouriteList;
