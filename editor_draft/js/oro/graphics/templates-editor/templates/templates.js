var Oro = Oro || {};
Oro.Graphics = Oro.Graphics || {};
Oro.Graphics.TemplatesEditor = Oro.Graphics.TemplatesEditor || {};

Oro.Graphics.TemplatesEditor.Templates = [
  {
    name: 'Элемент - 1',
    type: 'rect',

    settings:{
      color: {type: 'color', value: 'red', title: 'Цвет', configurable: true},
      width: {type: 'integer', value: 250, title: 'Ширина'},
      height: {type: 'integer', value: 200, title: 'Высота'}
    },
    
    children: [
      {
        type: 'image',
        name: 'Картинка',
        settings: {
          left: {type: 'integer', value: 80, title: 'Отступ слева', configurable: true},
          top: {type: 'integer', value: 20, title: 'Отступ сверху'},
          src: {value: 'http://assets.magtoapp.net/images/magtoapp46.png'},
          angle: {type: 'angle', title: 'Угол наклона', configurable: true, min: 0, max: 360}
        }
      },

      {
        name: 'Вложенный элемент - 1',
        type: 'rect',
        settings: {
          width: {type: 'integer', value: 20, title: 'Ширина', min: 10, max: 40, configurable: true},
          height: {type: 'integer', value: 30, title: 'Высота', configurable: true},
          left: {type: 'integer', value: 3, title: 'Отступ слева', configurable: true, min: 0},
          top: {type: 'integer', value: 4, title: 'Отступ сверху', configurable: true},
          color: {type: 'color', value: 'green', title: 'Цвет', configurable: true},
          angle: {type: 'angle', title: 'Угол наклона', configurable: true, min: 0, max: 360}
        }
      },

      {
        name: 'Вложенный элемент - 2',
        type: 'rect',
        settings: {
          width: {type: 'integer', value: 20, title: 'Ширина', configurable: true},
          height: {type: 'integer', value: 20, title: 'Высота', configurable: true},
          left: {type: 'integer', value: 25, title: 'Отступ слева', configurable: true},
          top: {type: 'integer', value: 4, title: 'Отступ сверху', configurable: true},
          color: {type: 'color', value: 'yellow', title: 'Цвет', configurable: true},
          angle: {type: 'angle', title: 'Угол наклона', configurable: true, min: 0, max: 360}
        }
      }
    ]
  },

  {
    name: 'Элемент - 2',
    type: 'rect',
    settings:{
      width: {type: 'integer', value: 150, title: 'Ширина'},
      height: {type: 'integer', value: 50, title: 'Высота'},
      color: {type: 'color', value: 'yellow', title: 'Цвет', configurable: true}
    },
    
    children: [
      {
        name: 'Вложенный элемент - 1',
        type: 'rect',
        settings: {
          width: {type: 'integer', value: 20, title: 'Ширина', configurable: true},
          height: {type: 'integer', value: 30, title: 'Высота', configurable: true},
          left: {type: 'integer', value: 3, title: 'Отступ слева', configurable: true},
          top: {type: 'integer', value: 4, title: 'Отступ сверху', configurable: true},
          color: {type: 'color', value: 'grey', title: 'Цвет', configurable: true}
        }
      },
      {
        name: 'Вложенный элемент - 2',
        type: 'rect',
        settings: {
          width: {type: 'integer', value: 20, title: 'Ширина', configurable: true},
          height: {type: 'integer', value: 20 , title: 'Высота', configurable: true},
          left: {type: 'integer', value: 25, title: 'Отступ слева', configurable: true},
          top: {type: 'integer', value: 4, title: 'Отступ сверху', configurable: true},
          color: {type: 'color', value: 'magenta', title: 'Цвет', configurable: true}          
        }
      }
    ]
  },

  {
    name: 'Template3',
    type: 'rect',
    settings:{
      width: {type: 'integer', value: 100},
      height: {type: 'integer', value: 50},
      color: {type: 'color', value: 'grey', configurable: true}
    },
    
    children: [
      {
        type: 'rect',
        settings: {
          width: {type: 'integer', value: 20, configurable: true},
          height: {type: 'integer', value: 30, configurable: true},
          left: {type: 'integer', value: 3, configurable: true},
          top: {type: 'integer', value: 4, configurable: true},
          color: {type: 'color', value: 'brown', configurable: true}
        }
      },
      {
        type: 'rect',
        settings: {
          width: {type: 'integer', value: 20, configurable: true},
          height: {type: 'integer', value: 20, configurable: true},
          left: {type: 'integer', value: 25, configurable: true},
          top: {type: 'integer', value: 4, configurable: true},
          color: {type: 'color', value: 'green', configurable: true}
        }
      }
    ]
  }

];
