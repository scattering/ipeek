var templates = templates || {};
templates.ncnr = templates.ncnr || {};
templates.ncnr.refl = templates.ncnr.refl || {};


(function reflectometry_templates(templates_slot) {
  var x0 = 10,
      y0 = 10, 
      dx = 135,
      dy = 40;
  var t = {};
  t["specular_single_background"] =  {
    "modules": [
      {
        title: "load spec",
        inputs: [],
        outputs: ["out"],
        x: x0,
        y: y0
      },
      {
        title: "load bg",
        inputs: [],
        outputs: ["out"],
        x: x0,
        y: y0 + dy
      },
      {
        title: "load slit",
        inputs: [],
        outputs: ["out"],
        x: x0,
        y: y0 + 2*dy
      },
      {
        title: "mask",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + dx,
        y: y0
      },
      {
        title: "mask",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + dx,
        y: y0 + dy
      },
      {
        title: "mask",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + dx,
        y: y0 + 2*dy
      },
      {
        title: "join",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + 2*dx,
        y: y0
      },
      {
        title: "join",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + 2*dx,
        y: y0 + dy
      },
      {
        title: "attenuate",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + 2*dx,
        y: y0 + 2*dy
      },
      {
        title: "join",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + 3*dx,
        y: y0 + 2*dy
      },
      {
        title: "subtract",
        inputs: ["subtrahend", "minuend"],
        outputs: ["out"],
        x: x0 + 3*dx,
        y: y0
      },
      {
        title: "normalize",
        inputs: ["numerator", "denominator"],
        outputs: ["out"],
        x: x0 + 4*dx,
        y: y0 + dy
      },
      {
        title: "footprint",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + 5*dx,
        y: y0 + dy
      }, 
    ],
    "wires": [
        {src: "0:out", tgt: "3:in"},
        {src: "1:out", tgt: "4:in"},
        {src: "2:out", tgt: "5:in"},
        {src: "3:out", tgt: "6:in"},
        {src: "4:out", tgt: "7:in"},
        {src: "5:out", tgt: "8:in"},
        {src: "8:out", tgt: "9:in"},
        {src: "6:out", tgt: "10:subtrahend"},
        {src: "7:out", tgt: "10:minuend"},
        {src: "10:out", tgt: "11:numerator"},
        {src: "9:out", tgt: "11:denominator"},
        {src: "11:out", tgt: "12:in"}
    ]
  };
  
  t["specular_plusminus_background"] =  {
    "modules": [
      {
        title: "load spec",
        module: "ncnr.refl.super_load",
        config: {"intent": "specular"},
        inputs: [],
        outputs: ["output"],
        x: x0,
        y: y0
      },
      {
        title: "load bgp",
        name: "ncnr.refl.load",
        inputs: [],
        outputs: ["output"],
        x: x0,
        y: y0 + dy
      },
      {
        title: "load bgm",
        name: "ncnr.refl.load",
        inputs: [],
        config: {},
        outputs: ["output"],
        x: x0,
        y: y0 + 2*dy
      },
      {
        title: "load slit",
        name: "ncnr.refl.load",
        inputs: [],
        outputs: ["output"],
        x: x0,
        y: y0 + 3*dy
      },
      {
        title: "mask",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + dx,
        y: y0
      },
      {
        title: "mask",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + dx,
        y: y0 + dy
      },
      {
        title: "mask",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + dx,
        y: y0 + 2*dy
      },
      {
        title: "mask",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + dx,
        y: y0 + 3*dy
      },
      {
        title: "join",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + 2*dx,
        y: y0
      },
      {
        title: "join_bg",
        inputs: ["in_plus", "in_minus"],
        outputs: ["out"],
        x: x0 + 2*dx,
        y: y0 + dy
      },
      {
        title: "attenuate",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + 2*dx,
        y: y0 + 3*dy
      },
      {
        title: "join",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + 3*dx,
        y: y0 + 3*dy
      },
      {
        title: "subtract",
        inputs: ["subtrahend", "minuend"],
        outputs: ["out"],
        x: x0 + 3*dx,
        y: y0
      },
      {
        title: "normalize",
        inputs: ["numerator", "denominator"],
        outputs: ["out"],
        x: x0 + 4*dx,
        y: y0 + dy
      },
      {
        title: "footprint",
        inputs: ["in"],
        outputs: ["out"],
        x: x0 + 5*dx,
        y: y0 + dy
      }, 
    ],
    "wires": [
        {src: "0:output", tgt: "4:in"},
        {src: "1:output", tgt: "5:in"},
        {src: "2:output", tgt: "6:in"},
        {src: "3:output", tgt: "7:in"},
        {src: "4:out", tgt: "8:in"},
        {src: "5:out", tgt: "9:in_plus"},
        {src: "6:out", tgt: "9:in_minus"},
        {src: "7:out", tgt: "10:in"},
        {src: "10:out", tgt: "11:in"},
        {src: "8:out", tgt: "12:subtrahend"},
        {src: "9:out", tgt: "12:minuend"},
        {src: "12:out", tgt: "13:numerator"},
        {src: "11:out", tgt: "13:denominator"},
        {src: "13:out", tgt: "14:in"}
    ]
  };
  
  $.extend(true, templates.ncnr.refl, t);
})();
