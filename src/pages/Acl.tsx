import React from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {toast} from 'react-toastify';
import AddAcl from '../components/AddAcl';
import Loading from '../components/Loading';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@mui/material';
import {Aclfn, deleteAclFn} from '../config';

interface Acl {
  id: string;
  mode: string;
  user?: {
    username: string;
  };
  proxies: [
    {
      port: string;
    },
  ];
}

function Acl() {
  let [isOpen, setIsOpen] = React.useState(false);
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

  function closeModal() {
    setIsOpen(false);
    (document.getElementById('roundePort') as HTMLInputElement).value = '';
  }

  function openModal() {
    setIsOpen(true);
  }

  const {isLoading, data, error} = useQuery({
    queryKey: ['acl'],
    queryFn: Aclfn,
  });

  const {mutate: deleteAcl} = useMutation((aclId: string) => deleteAclFn(aclId), {
    onSuccess(data) {
      queryClient.invalidateQueries('acl');
      toast.success('Acl deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Something went wrong: ${error.response.data.message}`);
    },
  });

  const onDeleteHandler = (aclId: string) => {
    deleteAcl(aclId);
  };

  if (isLoading) return <Loading />;
  if (error instanceof Error) {
    <p>error.message</p>;
  }

  return (
    <div>
      <AddAcl openModal={openModal} isOpen={isOpen} closeModal={closeModal} />
      <button onClick={openModal} className='my-3 w-24 rounded bg-[#111627] p-2 text-center text-white'>
        Add Acl
      </button>

      <div>
        {data?.data ? (
          <div>
            <p className='my-3 w-24 rounded bg-[#111627] p-2 text-center text-white'>Acl List</p>
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 650}} aria-label='simple table'>
                <TableHead className='tableHead'>
                  <TableRow>
                    <TableCell>‌Local Id</TableCell>
                    <TableCell>Mode</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Port</TableCell>
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className='tableBody'>
                  {data.data.map((row: Acl) => (
                    <TableRow key={row.id} className='tableRow'>
                      <TableCell component='th' scope='row'>
                        {row.id.slice(0, 4)}***{row.id.slice(32, 36)}
                      </TableCell>
                      <TableCell>{row.mode}</TableCell>
                      <TableCell component='th' scope='row'>
                        {row?.user?.username || 'All users'}
                      </TableCell>
                      <TableCell>
                        {(row.mode === 'all' ? ['All ports'] : row?.proxies).map((item: any) => (
                          <p> {item.port}</p>
                        ))}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => onDeleteHandler(row.id)}
                          className='rounded-md bg-red-600 p-2 font-bold text-white'
                        >
                          Delete Acl
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
    </div>
  );
}

export default Acl;
