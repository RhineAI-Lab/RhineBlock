import {Item, RootItem} from "../../../core/block/block.class";

export const easyTestData: RootItem[] = [
  {
    x: 100,
    y: 80,
    block: 'event_equipstate',
    args: [
      {
        next: true,
        block: 'logic_if',
        args: [
          {
            block: 'equipment_state',
            args: ['C','关']
          },{
            block: 'equipment_control',
            args: ['开启', 'C'],
          },
        ]
      }
    ]
  },
]

export const testData: RootItem[] = [
  {
    x: 100,
    y: 80,
    block: 'event_equipstate',
    args: [
      {
        next: true,
        block: 'logic_if',
        args: [
          {
            block: 'equipment_state',
            args: ['C','关']
          },{
            block: 'equipment_control',
            args: ['开启', 'C', {
              next: true,
              block: 'console_output',
              args: [{
                next: true,
                block: 'console_sleep',
              }]
            }],
          },{
            next: true,
            block: 'loop_times',
            args: [
              null,
              {
                block: 'console_output',
                args: [
                  {
                    block: 'equipment_getvalue',
                    args: ['C']
                  },{
                    next: true,
                    block: 'console_sleep',
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    x: 100,
    y: 420,
    block: 'event_change',
    args: [
      {
        next: true,
        block: 'loop_conditions',
        args: [
          {
            block: 'equipment_state',
          },{
            block: 'equipment_setvalue',
            args: ['B',{
              block: 'equipment_getvalue',
            }]
          },{
            next: true,
            block: 'equipment_control',
            args: ['关闭','B']
          }
        ]
      }
    ]
  }
]

