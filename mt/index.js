(function(options) {

  var routing, map;
  var start, end;

  function initMap(transport_mode) {
    routing = L.Routing.control({
      router: new L.Routing.MT(
        $.extend(options, { profile: transport_mode })
      ),
      waypoints: [ start, end ],
      routeWhileDragging: true
    }).addTo(map);
  }

  $.ajax({
    url: options.serviceUrl + '/capability',
    type: 'GET',
    dataType: 'json',
    data: { api_key: options.apiKey },
    success: function(data, textStatus, jqXHR) {
      $.each(data.route, function(i, item) {
        $('#transport-modes').append(
          $('<option>').val(item.mode).html(item.name)
        )
      });
      $('#transport-modes').change(function(e) {
        map.removeControl(routing);
        initMap($('#transport-modes').val());
      });
      map = L.map('map').setView(L.latLng(44.823360, -0.651695), 10);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
      initMap($('#transport-modes').val());
      $('#transport-modes').select2({ minimumResultsForSearch: -1 });

      map.on('click', function(e) {
        var container = L.DomUtil.create('div');
            startBtn = createButton('Start from this location', container),
            destBtn = createButton('Go to this location', container);

        L.popup().setContent(container).setLatLng(e.latlng).openOn(map);

        L.DomEvent.on(startBtn, 'click', function() {
          routing.spliceWaypoints(0, 1, e.latlng);
          map.closePopup();
          console.log(e.latlng);
          start = [e.latlng.lat, e.latlng.lng];
        });

        L.DomEvent.on(destBtn, 'click', function() {
          routing.spliceWaypoints(routing.getWaypoints().length - 1, 1, e.latlng);
          map.closePopup();
          console.log(e.latlng);
          end = [e.latlng.lat, e.latlng.lng];
        });

      });
    }
  });

  function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
  }


})({
  serviceUrl: 'https://router.mapotempo.com/0.1',
  apiKey: 'demo'
});
