import {TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination} from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {getIdentityFn, createIdentityFn, deleteIdentityFn} from '../config';
import {toast} from 'react-toastify';
import Loading from '../components/Loading';
import {getNativeSelectUtilityClasses} from '@mui/material';

interface IdentityData {
  identity: string;
  isUse: boolean;
  id: string;
}

function Identity() {
  const fileRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [file, setFile] = React.useState<File | string>('');
  const [fileName, setFileName] = React.useState<any>('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [passphrase, setPassphrase] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const queryClient = useQueryClient();
  const {isLoading, data} = useQuery({
    queryKey: ['identitykey'],
    queryFn: getIdentityFn,
  });
  const {mutate: deleteIdentity} = useMutation((identityId: string) => deleteIdentityFn(identityId), {
    onSuccess(data) {
      queryClient.invalidateQueries('identitykey');
      toast.success('Identity deleted successfully');
    },
  });
  const {
    mutate: createIdentity,
    error,
    isLoading: addLoading,
  } = useMutation((identity: FormData) => createIdentityFn(identity), {
    onSuccess: () => {
      queryClient.invalidateQueries(['identitykey']);
      toast.success('Identity created successfully');
      (document.getElementById('CommentBox') as HTMLInputElement).value = '';
      setFileName('');
    },
    onError: () => {
      setErrorMessage('Passphrase or json file is wrong');
    },
  });

  //function
  const onDeleteHandler = (identityId: string) => {
    deleteIdentity(identityId);
  };
  const onSubmitHandler = () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('passphrase', passphrase);
    createIdentity(formData);
  };
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const addImageToPost = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      setFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
      console.log(file);
    }
  };

  // show data

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className='border-box  border-b border-gray-200 font-sans text-gray-900'>
        <div className='mx-auto mt-1 flex w-full justify-center pb-8 sm:max-w-lg'>
          <div className=' flex h-auto w-full flex-col items-center justify-center bg-white sm:w-3/4 sm:rounded-lg sm:shadow-2xl'>
            <div className='mt-10 mb-10 text-center'>
              <h2 className='mb-2 text-2xl font-semibold'>Add Identity</h2>
              <p className='text-xs text-gray-500'>File should be of format .json</p>
            </div>
            {file && <p className='mb-2 flex items-center text-xs text-gray-500'>{fileName}</p>}

            <div
              onClick={() => fileRef.current?.click()}
              className='relative h-32 w-4/5 max-w-xs rounded-lg bg-gray-100 shadow-inner'
            >
              <input ref={fileRef} onChange={addImageToPost} type='file' id='file-upload' className='hidden' />
              <label
                htmlFor='file-upload'
                className='z-20 flex h-full w-full cursor-pointer flex-col-reverse items-center justify-center'
              >
                <p className='z-10 text-center text-xs font-light text-gray-500'>
                  Drag & Drop your files here or click file to upload
                </p>
                <svg
                  className='z-10 h-8 w-8 text-indigo-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z'></path>
                </svg>
              </label>
            </div>
            <div className='mt-2 mb-6 flex flex-col items-center justify-center '>
              <input
                type='password'
                placeholder='Passphrase'
                id='CommentBox'
                onChange={(e) => setPassphrase(e.target.value)}
                className=' border-blue-[#F3F4F6] border bg-gray-100 placeholder:pl-2 placeholder:text-xs'
              />
              {errorMessage ? <p className='mt-1 text-sm text-red-600'>{errorMessage}</p> : null}
              <button
                disabled={addLoading ? true : false}
                onClick={() => onSubmitHandler()}
                className={`${
                  addLoading ? 'cursor-not-allowed bg-[#63699e]' : 'cursor-pointer bg-[#818CF8]'
                } text-blue-800' mt-2 rounded p-1 px-2 text-sm text-white`}
              >
                {addLoading ? (
                  <svg
                    className='mr-2 inline h-4 w-4 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600'
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
                Add Identity
              </button>
            </div>
          </div>
        </div>
      </div>
      {data?.data ? (
        <TableContainer component={Paper} className='mt-6'>
          <Table sx={{minWidth: 650}} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>‌Identity</TableCell>
                <TableCell>In Use</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((row: IdentityData) => (
                <TableRow key={row.id}>
                  <TableCell component='th' scope='row'>
                    {row.identity}
                  </TableCell>
                  <TableCell>
                    <p className={clsx(row.isUse === false ? 'text-green-600' : 'text-red-500')}>
                      {row.isUse === false ? 'No' : 'Yes'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => onDeleteHandler(row.id)}
                      className='rounded-md bg-red-600 p-2 font-bold text-white'
                    >
                      Delete Identity
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
      ) : (
        <p className='flex items-center justify-center text-2xl font-bold'>
          {error instanceof Error && 'Something went wrong'}
        </p>
      )}
    </div>
  );
}

export default Identity;
