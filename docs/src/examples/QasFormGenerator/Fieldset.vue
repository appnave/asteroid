<template>
  <div class="container spaced">
    <qas-form-generator v-model="model" :columns="columns" :fields="fields" :fields-props="fieldsProps" :fieldset="fieldset" fieldset-gutter="lg" use-box>
      <template #legend-bottom-personalInformation>
        <div class="bg-blue">
          <div class="q-my-md">
            Estou dentro do slot <span class="text-bold">legend-bottom</span> do fieldset <span class="text-bold">personalInformation</span>
          </div>

          <qas-label label="Resumo" />

          <qas-grid-generator :fields="fields" :result="gridValues" use-inline />
        </div>
      </template>
    </qas-form-generator>

    <div class="q-mt-lg">
      model: <qas-debugger :inspect="[model]" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: {}
    }
  },

  computed: {
    columns () {
      return {
        isActive: { col: 12 },
        company: { col: 12 },
        phone: { col: 12 },
        manager: { col: 12, sm: 4 },
        supervisor: { col: 12, sm: 4 },
        realEstateBroker: { col: 12, sm: 4 }
      }
    },

    fieldsProps () {
      return {
        isActive: {
          'onUpdate:modelValue': value => alert(`Usuário ativo?: ${value}`)
        }
      }
    },

    gridValues () {
      return {
        isActive: false,
        company: 'empresa-1',
        name: 'Cleyton',
        email: 'cleyton@email.com.br'
      }
    },

    fieldset () {
      return {
        personalInformation: {
          label: 'Informações pessoais',
          description: 'Informe o nome e email do usuário.',
          fields: ['isActive', 'name', 'email'],
          column: '12',
          headerProps: {
            badges: [
              {
                label: 'Minha badge',
                textColor: 'grey-10'
              }
            ],
            buttonProps: {
              label: 'Atualizar',
              onClick: () => alert('Atualizando...')
            }
          }
        },

        address: {
          label: 'Endereço',
          description: 'Informe o endereço, cidade, estado e país do usuário.',
          fields: ['address', 'city', 'state', 'country'],
          column: { col: 12, sm: 6 }
        },

        another: {
          label: 'Outras informações',
          description: 'Informe o documento do usuário.',
          fields: ['phone', 'company'],
          column: { col: 12, sm: 6 }
        },

        salesTeam: {
          fields: ['manager', 'supervisor', 'realEstateBroker']
        }
      }
    },

    fields () {
      return {
        uuid: {
          name: 'uuid',
          type: 'hidden'
        },

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
            }
          ]
        },

        manager: {
          name: 'manager',
          label: 'Gerente',
          type: 'select',
          options: [
            {
              label: 'Cleyton da Silva',
              value: 'cleyton-da-silva'
            },
            {
              label: 'Julio Souza',
              value: 'julio-souza'
            }
          ]
        },

        supervisor: {
          name: 'supervisor',
          label: 'Supervisor',
          type: 'select',
          options: [
            {
              label: 'Cleyton da Silva',
              value: 'cleyton-da-silva'
            },
            {
              label: 'Julio Souza',
              value: 'julio-souza'
            }
          ]
        },

        realEstateBroker: {
          name: 'realEstateBroker',
          label: 'Corretor',
          type: 'select',
          options: [
            {
              label: 'Cleyton da Silva',
              value: 'cleyton-da-silva'
            },
            {
              label: 'Julio Souza',
              value: 'julio-souza'
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

        address: {
          name: 'address',
          label: 'Endereço',
          type: 'string'
        },

        city: {
          name: 'city',
          label: 'Cidade',
          type: 'string'
        },

        state: {
          name: 'state',
          label: 'Estado',
          type: 'string'
        },

        country: {
          name: 'country',
          label: 'País',
          type: 'string'
        }
      }
    }
  }
}
</script>
