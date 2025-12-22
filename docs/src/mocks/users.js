export const fields = {
  isActive: {
    name: 'isActive',
    label: 'Usuário ativo?',
    type: 'boolean',
    default: false
  },

  company: {
    name: 'company',
    label: 'Empresa',
    type: 'select',
    options: [
      {
        label: 'Empresa 1',
        value: 'empresa-1'
      },
      {
        label: 'Empresa 2',
        value: 'empresa-2'
      },
      {
        label: 'Empresa 3',
        value: 'empresa-3'
      },
      {
        label: 'Empresa 4',
        value: 'empresa-4'
      },
      {
        label: 'Empresa 5',
        value: 'empresa-5'
      },
      {
        label: 'Empresa 6',
        value: 'empresa-6'
      },
      {
        label: 'Empresa 7',
        value: 'empresa-7'
      },
      {
        label: 'Empresa 8',
        value: 'empresa-8'
      },
      {
        label: 'Empresa 9',
        value: 'empresa-9'
      },
      {
        label: 'Empresa 10',
        value: 'empresa-10'
      },
      {
        label: 'Empresa 11',
        value: 'empresa-11'
      }
    ]
  },

  companies: {
    name: 'companies',
    label: 'Empresa',
    type: 'select',
    multiple: true,
    options: [
      {
        label: 'Empresa 1',
        value: 'empresa-1'
      },
      {
        label: 'Empresa 2',
        value: 'empresa-2'
      },
      {
        label: 'Empresa 3',
        value: 'empresa-3'
      },
      {
        label: 'Empresa 4',
        value: 'empresa-4'
      },
      {
        label: 'Empresa 5',
        value: 'empresa-5'
      },
      {
        label: 'Empresa 6',
        value: 'empresa-6'
      },
      {
        label: 'Empresa 7',
        value: 'empresa-7'
      },
      {
        label: 'Empresa 8',
        value: 'empresa-8'
      },
      {
        label: 'Empresa 9',
        value: 'empresa-9'
      },
      {
        label: 'Empresa 10',
        value: 'empresa-10'
      }
    ]
  },

  name: {
    name: 'name',
    label: 'Nome',
    type: 'string'
  },

  email: {
    name: 'email',
    label: 'Email',
    type: 'email'
  },

  document: {
    name: 'document',
    label: 'Documento',
    type: 'string',
    mask: 'document'
  },

  phone: {
    name: 'phone',
    label: 'Telefone',
    type: 'string',
    mask: 'phone'
  },

  createdAt: {
    name: 'createdAt',
    label: 'Criado em',
    type: 'datetime'
  },

  date: {
    name: 'date',
    label: 'date',
    type: 'date'
  },

  observation: {
    name: 'observation',
    label: 'Observação',
    type: 'textarea'
  }
}

export const results = [
  {
    uuid: '31362c39-2cb5-4fe2-982a-c270f88d2462',
    isActive: true,
    company: 'empresa-1',
    companies: ['empresa-1', 'empresa-2'],
    name: 'John Doe',
    email: 'Mervin76@gmail.com',
    document: '12345678901',
    phone: '11912345678',
    createdAt: '2022-03-18T03:54:11.000Z',
    updatedAt: '2022-03-18T09:22:11.000Z',
    date: '2022-03-19',
    observation: 'Observação 1: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
  },
  {
    uuid: '3102fad5-f14c-45d4-98e9-46ef0aa9580e',
    isActive: true,
    company: '',
    companies: ['empresa-3', 'empresa-4', 'empresa-5'],
    name: 'Jane Smith',
    email: 'Esta.Bernier@hotmail.com',
    document: '12345678902',
    phone: '21987654321',
    createdAt: '2022-03-18T11:34:24.000Z',
    updatedAt: '2022-03-17T19:51:40.000Z',
    date: '2022-03-20',
    observation: 'Observação 2: BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'
  },
  {
    uuid: '1dad94b3-a0e0-4829-a7e1-be2af95348201',
    isActive: true,
    company: 'Qui eius dolor sapiente provident saepe.',
    companies: ['empresa-6'],
    name: 'Alice Johnson',
    email: 'Alyce_Dooley45@hotmail.com',
    document: '12345678903',
    phone: '31912349876',
    createdAt: '2022-03-18T10:03:01.000Z',
    updatedAt: '2022-03-18T06:46:42.000Z',
    date: '2022-03-21',
    observation: 'Observação 3: CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC'
  },
  {
    uuid: 'ac72e8a8-fcf9-4258-8ea2-bc49b612324dacb',
    isActive: true,
    company: 'Ab saepe aperiam.',
    companies: ['empresa-7', 'empresa-8'],
    name: 'Bob Martin',
    email: 'Tracy_Glover74@hotmail.com',
    document: '12345678904',
    phone: '41998761234',
    createdAt: '2022-03-18T04:12:22.000Z',
    updatedAt: '2022-03-18T02:47:44.000Z',
    date: '2022-03-22',
    observation: 'Observação 4: DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD'
  },
  {
    uuid: 'ce2e298a-be37-408f-a789-4c7b18b4315bc',
    isActive: true,
    company:
      'Atque cum illum debitis consequatur exercitationem dolorum corporis.',
    companies: ['empresa-9', 'empresa-10', 'empresa-11'],
    name: 'Carol King',
    email: 'Heloise_Hegmann@hotmail.com',
    document: '12345678905',
    phone: '51912345678',
    createdAt: '2022-03-18T00:00:44.000Z',
    updatedAt: '2022-03-17T23:34:47.000Z',
    date: '2022-03-23',
    observation: 'Observação 5: EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE'
  },
  {
    uuid: '62fc0a79-ddea-45b5-8d21-be6f0502923296',
    isActive: false,
    company: 'Sed occaecati cupiditate.',
    companies: ['empresa-10'],
    name: 'David Brown',
    email: 'Jillian_Wilkinson97@gmail.com',
    document: '12345678906',
    phone: '61987654321',
    createdAt: '2022-03-17T17:54:34.000Z',
    updatedAt: '2022-03-18T13:14:01.000Z',
    date: '2022-03-24',
    observation: 'Observação 6: FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
  },
  {
    uuid: '2f8856d0-8eca-4e41-8146-63ed2a4f23ff4c',
    isActive: false,
    company: 'Dolores minus iusto quo et dolorem eveniet nesciunt.',
    companies: ['empresa-1', 'empresa-3'],
    name: 'Emily Davis',
    email: 'Rafael91@hotmail.com',
    document: '12345678907',
    phone: '71912345678',
    createdAt: '2022-03-17T23:50:31.000Z',
    updatedAt: '2022-03-18T02:03:29.000Z',
    date: '2022-03-25',
    observation: 'Observação 7: GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG'
  },
  {
    uuid: '5bda242f-5e99-43dd-af6a-093d68cee1235f',
    isActive: false,
    company: 'Excepturi ad nihil est.',
    companies: ['empresa-4', 'empresa-5', 'empresa-6'],
    name: 'Frank Wilson',
    email: 'Katelyn_Bernhard76@gmail.com',
    document: '12345678908',
    phone: '81987654321',
    createdAt: '2022-03-17T20:21:06.000Z',
    updatedAt: '2022-03-18T15:06:04.000Z',
    date: '2022-03-26',
    observation: 'Observação 8: HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH'
  },
  {
    uuid: '620c8045-acc8-4c53-b083-fe7ed991233cf5',
    isActive: false,
    company: 'Quis ea voluptas recusandae omnis.',
    companies: ['empresa-7', 'empresa-8'],
    name: 'Grace Lee',
    email: 'Syble42@yahoo.com',
    document: '12345678909',
    phone: '91912345678',
    createdAt: '2022-03-17T22:51:23.000Z',
    updatedAt: '2022-03-18T03:13:33.000Z',
    date: '2022-03-27',
    observation: 'Observação 9: IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII'
  }
]
