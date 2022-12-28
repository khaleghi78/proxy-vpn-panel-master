import {Dialog, Transition} from '@headlessui/react';
import React, {Fragment, useState} from 'react';
import {useQuery, useQueryClient} from 'react-query';
import {Aclfn, allUserFn, api} from '../config';
import Loading from './Loading';
import {toast} from 'react-toastify';
import {XMarkIcon, PlusIcon, PlusCircleIcon} from '@heroicons/react/24/solid';
import {Tooltip} from '@mui/material';

interface userList {
  id: string;
  username: string;
}

interface PortList {
  port: number;
}

export default function AddAcl({closeModal, openModal, isOpen}: any) {
  const [portNumber, setPortNumber] = useState('');
  const [items, setItems] = useState<any>([]);
  const [userId, setUserId] = React.useState('');
  const [accessType, setAcessType] = useState('all');
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const handleAddButtonClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newPort = {
      port: +portNumber,
    };
    const newPorts = [...items, newPort];

    setItems(() => {
      return newPorts;
    });
    console.log(newPorts);
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAcessType(event.target.value);
  };

  function Close() {
    closeModal();
    setItems([]);
    (document.getElementById('roundePort') as HTMLInputElement).value = '';
  }

  const {data: dataAcl} = useQuery({
    queryKey: ['acl'],
    queryFn: Aclfn,
  });
  const CreateAclfn = async () => {
    if (userId === '') {
      try {
        await api.post(
          '/acl',
          {
            mode: accessType,
            type: 1,
            proxies: items,
          },
          {headers: {Authorization: `Bearer ${token}`}},
        );
        toast.success('acl added successfully');
        closeModal();
        queryClient.invalidateQueries('acl');
        (document.getElementById('roundePort') as HTMLInputElement).value = '';
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
      }
    } else {
      try {
        await api.post(
          '/acl',
          {
            mode: accessType,
            type: 1,
            user: {
              id: userId,
            },
            proxies: items,
          },
          {headers: {Authorization: `Bearer ${token}`}},
        );
        toast.success('acl added successfully');
        setItems([]);
        closeModal();
        queryClient.invalidateQueries('acl');
        Aclfn();
        (document.getElementById('roundePort') as HTMLInputElement).value = '';
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
      }
    }
  };

  const {isLoading, data, error} = useQuery({
    queryKey: ['userlist'],
    queryFn: allUserFn,
  });

  if (isLoading) return <Loading />;
  if (error instanceof Error) {
    <p>error.message</p>;
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={Close}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-[700px]  transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <div className='flex justify-between'>
                    <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                      Add Acl
                    </Dialog.Title>
                    <XMarkIcon className='h-5 w-5 cursor-pointer' onClick={Close} />
                  </div>
                  <div className='flex items-center justify-between gap-4'>
                    <div className='mt-2'>
                      <select
                        className='w-[300px]  appearance-none rounded-lg border border-transparent border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600'
                        name='cars'
                        id='cars'
                        onChange={handleChange}
                      >
                        <option value='all'>Acess all user to all ports</option>
                        <option value='all'>Acess one user to all ports</option>
                        <option value='custom'>acess one user to one ports</option>
                        <option value='custom'>acess one user to multiple ports</option>
                      </select>
                    </div>
                    <div className='mt-2'>
                      <select
                        className='w-full flex-1 appearance-none rounded-lg border border-transparent border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600'
                        name='user'
                        id='user'
                        onChange={(e) => setUserId(e.target.value)}
                      >
                        <option value='null'>User</option>
                        {data.data.map((item: userList) => (
                          <option value={item.id}>{item.username}</option>
                        ))}
                      </select>
                    </div>
                    <div className='mt-2 flex flex-col'>
                      <div className='flex items-center gap-1'>
                        <input
                          type='text'
                          id='roundePort'
                          className=' w-full flex-1 appearance-none rounded-lg border border-transparent border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600'
                          placeholder='Port'
                          onChange={(e) => setPortNumber(e.target.value)}
                        />
                        <Tooltip title='add port'>
                          <PlusCircleIcon
                            onClick={(e) => handleAddButtonClick(e)}
                            className='h-5 w-5 bg-green-500 text-white'
                          />
                        </Tooltip>
                      </div>
                      <div className='mt-1'>
                        {items.map((item: PortList) => (
                          <div key={item.port}>Port: {item.port}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='mt-4'>
                    <button
                      type='button'
                      className='inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={() => CreateAclfn()}
                    >
                      Add Acl <PlusIcon className='ml-1 h-5 w-5' />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
