var _ = require('lodash');


function Customer() {

  var proxy = new Proxy({
    save: function(){
      if(!this.dirty){
        return console.log('Not saving, object still clean');
      }

      console.log('proceeding with expensive saving operation!');
      var updateCmd = _(this).pick(this.changedProperties).value();
      console.log('db.customers.update({_id: %s}, {$set: %s})', this._id, JSON.stringify(updateCmd));
    },
    _id: 6
  }, {
    get: function(target, name, receiver) {
      return Reflect.get(target, name, receiver);
    },
    set: function(target, name, value, receiver) {
      target.dirty = true;
      target.changedProperties = target.changedProperties || [];
      if(target.changedProperties.indexOf(name) == -1){
        target.changedProperties.push(name);
      }
      return Reflect.set(target, name, value, receiver);
    }
  });


  return proxy;
}

var customer = new Customer();
customer.name = 'hendrik';
customer.surname = 'swanepoel';
customer.save();



