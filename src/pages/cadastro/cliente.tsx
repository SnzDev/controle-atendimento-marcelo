

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Head from "next/head";
import Image from 'next/image';
import ListSubheader from '@mui/material/ListSubheader';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Talisson Félix', 159, 6.0, 24, 4.0),
  createData('Marcelo Vieira', 237, 9.0, 37, 4.3),
  createData('Rai de Macedo', 262, 16.0, 24, 6.0),
];

function Cliente() {
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <Head>
        <title>Serviço</title>
        <meta name="description" content="cadastro de serviços" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <Image src="/Logo.png" width={95} height={95} alt="Logo AcesseNet" />
        <h1 className="text-stone-50 font-bold text-3xl"> AcesseNet</h1>
        <h3 className="text-stone-500 font-semibold text-lg">Cadastro de cliente</h3>
        <div className="w-full px-4 py-3 justify-center">
          <div className='flex justify-center gap-10'>
            {/* <div>
              <List
                className='bg-black  text-stone-100 w-[500px] justify-center'
              >
                <ListItemButton onClick={handleClick} className='bg-stone-900 hover:bg-slate-600'>
                  <ListItemText className='text-stone-100 font-semibold text-base'>
                    Cadastro de Cliente
                  </ListItemText>
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                      <form className="flex flex-col justify-items-center">
                        <div>
                          <p className="text-stone-100 font-semibold text-base">Nome do cliente</p>
                          <span className="flex row items-center pl-1.5">
                            <Image src="/icons/User.svg" className="mr-[-32px] z-10" width={24} height={24} alt="icone usuário" />
                            <input
                              className="rounded p-2 pl-10 items-center my-2 w-80 text-stone-100 bg-stone-900"
                              type="text"
                              placeholder="Maria Cardoso Santos"
                            />
                          </span>
                        </div>
                        <div className="flex row justify-center">
                          <button className="p-2 mt-4 rounded w-80 font-semibold bg-blue-500 hover:bg-blue-300" >Cadastrar</button>
                        </div>
                      </form>
                    </ListItemButton>
                  </List>
                </Collapse>
              </List>
            </div> */}
            <div className='flex gap-10 items-center justify-between'>
              <form className="flex justify-items-center gap-10">
                <div>
                  <p className="text-stone-100 font-semibold text-base">Nome do cliente</p>
                  <span className="flex row items-center pl-1.5">
                    <Image src="/icons/User.svg" className="mr-[-32px] z-10" width={24} height={24} alt="icone usuário" />
                    <input
                      className="rounded p-2 pl-10 items-center my-2 w-80 text-stone-100 bg-stone-900"
                      type="text"
                      placeholder="Maria Cardoso Santos"
                    />
                  </span>
                </div>
                <div className="flex row justify-center">
                  <button className="p-2 mt-8 rounded w-40 h-10 font-semibold bg-blue-500 hover:bg-blue-300" >Cadastrar</button>
                </div>
              </form>
              <div>
                <p className="text-stone-100 font-semibold text-base">Pesquisa</p>
                <span className="flex row items-center pl-1.5">
                  <Image src="/icons/Search.svg" className="mr-[-32px] z-10" width={24} height={24} alt="icone usuário" />
                  <input
                    className="rounded p-2 pl-10 items-center my-2 w-80 text-stone-100 bg-stone-900"
                    type="text"
                    placeholder="Pesquisa"
                  />
                </span>
              </div>
            </div>
          </div>
          <TableContainer component={Paper} className='mt-4 text-stone-100 bg-stone-900 border-r-8 border-l-8'>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead >
                <TableRow >
                  <TableCell className='text-stone-100'>Nome do cliente</TableCell>
                  <TableCell className='text-stone-100' align="right"></TableCell>
                  <TableCell className='text-stone-100' align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody >
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell className='text-stone-100' component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell className='text-stone-100' align="right">
                      <button className="p-2 mt-4 rounded w-20 font-semibold bg-blue-500 hover:bg-blue-300" >
                        Editar
                      </button>
                    </TableCell>
                    <TableCell className='text-stone-100' align="right">
                      <button className="p-2 mt-4 rounded w-20 font-semibold bg-blue-500 hover:bg-blue-300" >
                        Editar
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>
    </>
  )
}

export default Cliente