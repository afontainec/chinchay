const oneDay = 24 * 60 * 60 * 1000;

module.exports = [{
  name: 'Streetpark Las Condes',
  description: 'El streetpark Las Condes es un parque público para hacer patinaje, skateboard, entre otros. Este parque reproduce los lugares más típicos de una ciudad que sean atractivos para los skaters. Este se encuentra ubicado en el parque araucano, colindando con Av. Manquehue Norte. Su cercanía con el Parque Arauco puede ser atractivos para marcas presentes en este mall ya que les puede servir para dirigir gente hacia sus tiendas.',
  daily_visits: 500,
  is_active: true,
  created_at: new Date(),
}, {
  name: 'Barrio Franklin',
  description: '',
  daily_visits: 45000,
  is_active: true,
  created_at: new Date(new Date().getTime() - (oneDay * 2)),
}, {
  name: 'Mercado Central',
  description: '',
  daily_visits: 2020,
  is_active: true,
  created_at: new Date(new Date().getTime() - (oneDay * 4)),

}, {
  name: 'Other place',
  description: '',
  daily_visits: 2020,
  is_active: false,
  created_at: new Date(new Date().getTime() - (oneDay * 6)),
}];
