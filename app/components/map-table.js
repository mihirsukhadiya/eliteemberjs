import Component from '@ember/component';
import { set } from '@ember/object'
import { isPresent, isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import { run, cancel } from '@ember/runloop';
import { isArray } from '@ember/array';
import { equal } from '@ember/object/computed';
import ENV from '../config/environment';

const options = {
  xhrFields: { withCredentials: true }
};

export default Component.extend({
  ajax: service(),
  datetimeHistory: service(),
  rootURL: ENV.rootURL,
  tagName: '',
  previousActiveModel: '',
  setInterval: '',
  mapMarkers: '',
  isHistoryRoute: equal('currentRoute', 'history'),
  init() {
    this._super(...arguments);
    if (this.currentRoute == "map") {
      this.send('locateAllDevices', this.model);
    }
  },
  activeStateTable(vehicleInfo) {
    if (this.previousActiveModel.id != vehicleInfo.id) {
      set(vehicleInfo, 'activeState', true);
      if (isPresent(this.previousActiveModel)) {
        this.set('previousActiveModel.locationLoadedOnce', false);
        this.set('previousActiveModel.activeState', false);
      }
      this.set('previousActiveModel', vehicleInfo);
    }
  },

  fetchVehicleLocation(device, isArray) {
    if (isArray) { //map all
      let deviceArr = device.map((deviceObj) => deviceObj.id);
      options["data"] = { 'data': JSON.stringify({ deviceArr }) };
      options["method"] = 'POST';
      return this.get('ajax').request('/devLocation/getDeviceLocation.php', options);
    } else {
      if (this.currentRoute === "map") {
        return this.get('ajax').raw('/devLocation/getDeviceLocation.php?device_id=' + device, options);
      } else if (this.currentRoute === "history") {
        let fromTime = new Date(this.from_time);
        let toTime = new Date(this.to_time);
        let duration = (toTime.getTime() - fromTime.getTime()) / 3600000;
        if (duration > 18) {
          this.notifyError("Sorry, maximum time period limit is 18 hours");
          return Promise.reject();
        }
        return this.get('ajax').raw('/devLocation/getDeviceHistory.php?device_id=' + device + "&from_time=" + this.from_time + "&to_time=" + this.to_time, options);
      }
    }
  },

  calculateDistance() {
    if (this.vehiLatLng.length === 1) {
      this.set('distance', 0);
    }
    let calculatedDistance = 0;
    let isEnter = 0;
    for (let i=0; i < this.vehiLatLng.length - 1; i++) {
      let firstLat = this.vehiLatLng[i].Lat * (Math.PI / 180);
      let firstLongi = this.vehiLatLng[i].Longi * (Math.PI / 180);
      let secondLat = this.vehiLatLng[i + 1].Lat *(Math.PI / 180);
      let secondLongi = this.vehiLatLng[i + 1].Longi * (Math.PI / 180);
      // let lonDelta = secondLongi - firstLongi;
      // let first = Math.pow((Math.cos(secondLat) * Math.sin(lonDelta)), 2) +
      //             Math.pow((Math.cos(firstLat) * Math.sin(secondLat) - Math.sin(firstLat) * Math.cos(secondLat) * Math.cos(lonDelta)), 2);
      // let second = Math.sin(firstLat) * Math.sin(secondLat) + Math.cos(firstLat) * Math.cos(secondLat) * Math.cos(lonDelta);
      // let angle = Math.atan2(Math.sqrt(first), second);
      //let distanceBetweenTwoPoints = 6371000 * angle;
      let distanceBetweenTwoPoints = 6371000 * Math.acos(  Math.cos(firstLat) * Math.cos(secondLat) * Math.cos(secondLongi - firstLongi) + Math.sin(firstLat) * Math.sin(secondLat));
      if (isNaN(distanceBetweenTwoPoints)) {
        distanceBetweenTwoPoints = 0;
      }
      calculatedDistance += parseFloat(distanceBetweenTwoPoints.toFixed(4));
    }
    if (calculatedDistance > 1000) {
      calculatedDistance = calculatedDistance /1000;
      calculatedDistance = calculatedDistance.toFixed(4);
      calculatedDistance += " Km";
    } else {
        calculatedDistance = calculatedDistance.toFixed(4);
        calculatedDistance += " m";
    }
    this.set('distance', calculatedDistance);
  },

  resetDistance() {
    this.set('distance', 0);
  },

  selectMarkerType(vehiLocation, vehicleInfo) {
    let markerType = "";
    let vehicleType = "TE";
    if (vehicleInfo.eqpt_type == "excavator") {
      return "excavator.png";
    }
    if (['IE', 'LC', 'SP', 'SS', 'LD', 'SE', 'SL', 'TE', 'TL', 'UL', 'WL'].includes(vehiLocation.state)) {
      vehicleType = vehiLocation.state;
    }
    return vehicleType +".png";
  },

  async setMarkersInMap(vehicleInfos, isAnimation = false) {
     if (this.currentRoute === "map") {
      if (isPresent(this.mapMarkers) && this.mapMarkers.setMap) {
        this.mapMarkers.setMap(null);
      }
      run.later(() => {
        if (isPresent(this.vehiLatLng)) {
          if (isArray(this.vehiLatLng)) {
            this.vehiLatLng.forEach((vehiLatLng) => {
              var infowindow = new google.maps.InfoWindow({
                content: vehiLatLng.id
              });
              let marker = {
                position: new google.maps.LatLng(vehiLatLng.Lat, vehiLatLng.Longi),
                map: this.map
              }
              set(marker, 'icon', this.rootURL + "assets/" + this.selectMarkerType(vehiLatLng, vehicleInfos.filterBy('id', vehiLatLng.id)[0]));
              this.set('mapMarkers', new google.maps.Marker(marker));
              this.mapMarkers.addListener('click', function() {
                infowindow.open(this.map, this.mapMarkers);
              });
              infowindow.open(this.map, this.mapMarkers);
            });
          } else {
            var infowindow = new google.maps.InfoWindow({
              content: "<div>Device Id: "+ vehicleInfos.id + "</div><br>"+
                       "<div>State: "+ this.vehiLatLng.state + "</div><br>"+
                       "<div>Time: "+ this.vehiLatLng.time + "</div><br>"
            });
            let marker = {
              position: new google.maps.LatLng(this.vehiLatLng.Lat, this.vehiLatLng.Longi),
              map: this.map
            }
            set(marker, 'icon', this.rootURL + "assets/" + this.selectMarkerType(this.vehiLatLng, vehicleInfos));
            this.set('mapMarkers', new google.maps.Marker(marker));
            this.mapMarkers.addListener('mouseover', function() {
              infowindow.open(this.map, this);
            });
            infowindow.open(this.map, this.mapMarkers);
          }
        }
      }, 500);
    } else if (this.currentRoute === "history") {
      let index = 0;
      let flightPathCoordinates = [];
      this.set('animationDelay', 300);
      this.set('animationEnded', 0);
      for (let vehiLatLng of this.vehiLatLng) {
        var marker = {
          position: new google.maps.LatLng(vehiLatLng.Lat, vehiLatLng.Longi),
          map: this.map
        }
        let infowindow = new google.maps.InfoWindow({
          content: "<div>Device Id: "+ vehicleInfos.id + "</div><br>"+
                   "<div>State: "+ vehiLatLng.state + "</div><br>"+
                   "<div>Time: "+ vehiLatLng.time + "</div><br>"
        });

        flightPathCoordinates.push({
          lat: parseFloat(vehiLatLng.Lat),
          lng: parseFloat(vehiLatLng.Longi)
        });

        let flightPath = new google.maps.Polyline({
            path: flightPathCoordinates,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2
            // icons: [{
            //   icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
            //   offset: '100%'
            // }]
        });
        flightPath.setMap(this.map);
        set(marker, 'icon', this.rootURL + "assets/" + this.selectMarkerType(vehiLatLng, vehicleInfos));
        this.set('mapMarkers', new google.maps.Marker(marker));
        this.mapMarkers.addListener('mouseover', function() {
          infowindow.open(this.map, this);
        });
        this.mapMarkers.addListener('mouseout', function() {
          infowindow.close();
        });
        if (index == 0) {
          var firstInfo = new google.maps.InfoWindow({
            content: "START"
          });
          firstInfo.open(this.map, this.mapMarkers);
          index++;
        }
        let thisInstance = this;
        if (isAnimation) {
          let promise = new Promise(function (resolve, reject) {
              setTimeout(function(){
                thisInstance.mapMarkers.setMap(null);
                if (thisInstance.animationDelay > 0) {
                  resolve();
                } else {
                  reject();
                }
              }, thisInstance.animationDelay);
          });
          let result = await promise;
        }
      }
      this.set('animationEnded', 1);
      var lastInfo = new google.maps.InfoWindow({
        content: "END"
      });
      lastInfo.open(this.map, this.mapMarkers);
    }
  },

  async configureGMap(vehicleInfo, isAnimation) {
    if (typeof google === 'object' && typeof google.maps === 'object') {
      if (this.currentRoute === 'map') {
        let deviceId = vehicleInfo.id;
        let _this = this;
        this.setMarkersInMap(vehicleInfo);
        this.set('setInterval', run.later(function() {
            if (_this.isDestroyed) {
              return;
            }
            _this.fetchVehicleLocation(deviceId, false).then(({ response: { data } }) => {
            _this.set('vehiLatLng', data);
            _this.configureGMap(vehicleInfo);
          });
        }, 15000));
      } else if (this.currentRoute === "history") {
        this.setMapBounds();
        //this.calculateDistance();
        this.setMarkersInMap(vehicleInfo, isAnimation);
      }
    } else {
      this.notifyError("map is loaded");
    }
  },

  locateLastLocation(vehicleInfo) {
    if (!vehicleInfo.locationLoadedOnce) {
      set(vehicleInfo, 'locationLoading', true);
    }
    this.fetchVehicleLocation(vehicleInfo.id, false).then(({ response: { data } }) => {
      if (!vehicleInfo.locationLoadedOnce) {
        set(vehicleInfo, 'locationLoadedOnce', true);
      }
      this.set('distance', '');
      if (isPresent(data)) {
        this.set('deviceId', vehicleInfo.id);
        this.activeStateTable(vehicleInfo);
        if (isPresent(this.setInterval)) {
          cancel(this.setInterval);
        }
        this.set('animationDelay', 0);
        if (isPresent(this.mapMarkers) && this.mapMarkers.setMap) {
          this.mapMarkers.setMap(null);
        }
      }
      this.set('vehiLatLng', data);
      if (isPresent(this.vehiLatLng)) {
        let mapProp = {
         center: new google.maps.LatLng(this.vehiLatLng.Lat, this.vehiLatLng.Longi),
         zoom: 15,
         mapTypeId: 'terrain'
        };
        this.set('map', new google.maps.Map(document.getElementById("g-map"), mapProp));
        this.configureGMap(vehicleInfo);
      } else {
        this.notifyError("Sorry there are no locations for this device id");
      }
    }).catch((message) => {
      let { status } = message;
      if (status === 302) {
        if (isEmpty(window.sessionStorage.gps_website)) {
          window.location.reload(true);
        }
        window.location.assign(window.sessionStorage.gps_website);
      } else {
        console.log(message);
        let { response: { payload }} = message;
        if (isPresent(payload.message)) {
          this.notifyError(payload.message);
        } else {
          this.notifyError("Error while fetching the location");
        }
      }
    }).finally(() => {
      if (vehicleInfo.locationLoading) {
        set(vehicleInfo, 'locationLoading',false);
      }
    });
  },

  locateVehicleHistory(vehicleInfo, isAnimation) {
    let dateRanges = $('#daterange').val().split("-");
    let from_time = window.moment(dateRanges[0].trim()).format('YYYY-MM-D H:mm');
    let to_time = window.moment(dateRanges[1].trim()).format('YYYY-MM-D H:mm');
    this.set('from_time', from_time);
    this.set('to_time', to_time);
    if (isAnimation) {
      this.toggleProperty('additionalOptionLoading');
    } else {
      if (!vehicleInfo.locationLoadedOnce) {
        set(vehicleInfo, 'locationLoading', true);
      }
    }
    this.fetchVehicleLocation(vehicleInfo.id, false).then(({ response: { data, distance } }) => {
      if (!vehicleInfo.locationLoadedOnce) {
        set(vehicleInfo, 'locationLoadedOnce', true);
      }
      if (isPresent(data)) {
        this.activeStateTable(vehicleInfo);
        this.set('deviceId', vehicleInfo.id);
        this.set('selectedVehicle', vehicleInfo);
        this.set('mapFromTime', from_time);
        this.set('mapToTime', to_time);
        this.set('distance', distance+' Km');
        this.set('vehiLatLng', data);
        let lat = this.vehiLatLng[0].Lat || 11.5;
        let long = this.vehiLatLng[0].Longi || 64.5;
        let mapProp = {
         center: new google.maps.LatLng(lat, long),
         zoom: 15,
         mapTypeId: 'terrain'
        };
        this.set('map', new google.maps.Map(document.getElementById("g-map"), mapProp));
        this.configureGMap(vehicleInfo, isAnimation);
      } else {
        this.notifyError("There are no locations available for the given time period");
      }
    }).catch((message) => {
      console.log(message);
      let { status } = message;
      if (status === 302) {
        if (isEmpty(window.sessionStorage.gps_website)) {
          window.location.reload(true);
        }
        window.location.assign(window.sessionStorage.gps_website);
      } else {
        let { response: { payload }} = message;
        if (isPresent(payload.message)) {
          this.notifyError(payload.message);
        } else {
          this.notifyError("Error while fetching the location");
        }
      }
    }).finally(() => {
      if (isAnimation) {
        this.toggleProperty('additionalOptionLoading');
      } else {
        if (vehicleInfo.locationLoading) {
          set(vehicleInfo, 'locationLoading',false);
        }
      }
    });
  },
  setMapBounds() {
    let X = 0, Y = 0, Z = 0;
    // avg center
    this.vehiLatLng.forEach((latLng) => {
      let lat = latLng.Lat * Math.PI / 180;
      let lon = latLng.Longi * Math.PI / 180;
      X += Math.cos(lat) * Math.cos(lon);
      Y += Math.cos(lat) * Math.sin(lon);
      Z += Math.sin(lat);
    });

    X /= this.vehiLatLng.length;
    Y /= this.vehiLatLng.length;
    Z /= this.vehiLatLng.length;

    let avglat =  Math.atan2(Z, Math.sqrt(X * X + Y * Y)) * 180 / Math.PI;
    let avglong =  Math.atan2(Y, X) * 180 / Math.PI;

    let mapProp = {
     zoom: 15,
     center: new google.maps.LatLng(avglat, avglong),
     mapTypeId: 'terrain'
    };
    this.set('map', new google.maps.Map(document.getElementById("g-map"), mapProp));

    // fit bounds
    let bounds = new google.maps.LatLngBounds();
    this.vehiLatLng.forEach((latLng) => {
      bounds.extend(new google.maps.LatLng(latLng.Lat, latLng.Longi));
    });
    this.map.fitBounds(bounds);
  },
  actions: {

    locateDevice(vehicleInfo, isAnimation) {
      if (isAnimation) {
        this.set('additionalOptionLoading', false);
      }
      if (isPresent(this.setInterval)) {
        cancel(this.setInterval);
      }
      this.set('disableDistanceLink', false);
      if (this.currentRoute === "map") {
        this.locateLastLocation(vehicleInfo);
      } else if (this.currentRoute === "history") {
        if (isAnimation && this.animationEnded == 0) {
          this.set('animationDelay', 0);
          let thisInstance = this;
          setTimeout(function() {
            thisInstance.locateVehicleHistory(vehicleInfo, isAnimation);
          }, 3000);
        } else {
          this.locateVehicleHistory(vehicleInfo, isAnimation);
        }
      }
    },

    async locateAllDevices(deviceArr) {
      this.toggleProperty('additionalOptionLoading');
      this.set('deviceId', "");
      this.set('distance', '');
      this.fetchVehicleLocation(deviceArr, true).then(({ data }) => {
        if (isPresent(data)) {
          if (isPresent(this.previousActiveModel)) {
            this.set('previousActiveModel.activeState', false);
          }
          if (isPresent(this.setInterval)) {
            cancel(this.setInterval);
          }
          this.set('vehiLatLng', data);
          this.setMapBounds();
          this.setMarkersInMap(deviceArr);
        } else {
          this.notifyError("Sorry, there are no locations available");
        }
      }).catch((message) => {
        let { status } = message;
        if (status === 302) {
          if (isEmpty(window.sessionStorage.gps_website)) {
            window.location.reload(true);
          }
          window.location.assign(window.sessionStorage.gps_website);
        } else {
          console.log(message);
          this.notifyError("Error while fetching the location");
        }
      }).finally(() => {
        this.toggleProperty('additionalOptionLoading');
      });
    }
  },

  willDestroyElement() {
    if (isPresent(this.setInterval)) {
      cancel(this.setInterval);
    }
    this.set('deviceId', '');
    this.set('mapFromTime', '');
    this.set('mapToTime', '');
    this.set('distance', '');
    this._super(...arguments);
  }

});
