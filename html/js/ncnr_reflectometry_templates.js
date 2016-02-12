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
      "module": "ncnr.refl.super_load",
      "title": "load spec",
      "config": {"intent": "specular"},
      "module_id": 0,
      "x": 50,
      "y": 30
    },
    {
      "module": "ncnr.refl.mask_points",
      "title": "mask",
      "module_id": 1,
      "x": 190,
      "y": 30
    },
    {
      "module": "ncnr.refl.join",
      "title": "join",
      "module_id": 2,
      "x": 330,
      "y": 30
    },
    {
      "module": "ncnr.refl.super_load",
      "title": "load bg+",
      "config": {"intent": "background+"},
      "module_id": 3,
      "x": 50,
      "y": 70
    },
    {
      "module": "ncnr.refl.mask_points",
      "title": "mask",
      "module_id": 4,
      "x": 190,
      "y": 70
    },
    {
      "module": "ncnr.refl.super_load",
      "title": "load bg-",
      "config": {"intent": "background-"},
      "module_id": 5,
      "x": 50,
      "y": 110
    },
    {
      "module": "ncnr.refl.mask_points",
      "title": "mask",
      "module_id": 6,
      "x": 190,
      "y": 110
    },
    {
      "module": "ncnr.refl.join",
      "title": "join",
      "module_id": 7,
      "x": 330,
      "y": 110
    },
    {
      "module": "ncnr.refl.join",
      "title": "join",
      "module_id": 8,
      "x": 330,
      "y": 70
    },
    {
      "module": "ncnr.refl.super_load",
      "title": "load slit",
      "config": {"intent": "intensity"},
      "module_id": 9,
      "x": 50,
      "y": 150
    },
    {
      "module": "ncnr.refl.mask_points",
      "title": "mask",
      "module_id": 10,
      "x": 190,
      "y": 150
    },
    {
      "module": "ncnr.refl.subtract_background",
      "title": "sub bg",
      "module_id": 11,
      "x": 470,
      "y": 30
    },
    {
      "module": "ncnr.refl.rescale",
      "title": "rescale",
      "module_id": 12,
      "x": 330,
      "y": 150
    },
    {
      "module": "ncnr.refl.join",
      "title": "join",
      "module_id": 13,
      "x": 470,
      "y": 150
    },
    {
      "module": "ncnr.refl.divide_intensity",
      "title": "divide",
      "module_id": 14,
      "x": 615,
      "y": 70
    }
  ],
  "wires": [
    {
      "source": [
        0,
        "output"
      ],
      "target": [
        1,
        "data"
      ]
    },
    {
      "source": [
        1,
        "output"
      ],
      "target": [
        2,
        "data"
      ]
    },
    {
      "source": [
        2,
        "output"
      ],
      "target": [
        11,
        "data"
      ]
    },
    {
      "source": [
        3,
        "output"
      ],
      "target": [
        4,
        "data"
      ]
    },
    {
      "source": [
        4,
        "output"
      ],
      "target": [
        8,
        "data"
      ]
    },
    {
      "source": [
        8,
        "output"
      ],
      "target": [
        11,
        "backp"
      ]
    },
    {
      "source": [
        5,
        "output"
      ],
      "target": [
        6,
        "data"
      ]
    },
    {
      "source": [
        6,
        "output"
      ],
      "target": [
        7,
        "data"
      ]
    },
    {
      "source": [
        7,
        "output"
      ],
      "target": [
        11,
        "backm"
      ]
    },
    {
      "source": [
        9,
        "output"
      ],
      "target": [
        10,
        "data"
      ]
    },
    {
      "source": [
        10,
        "output"
      ],
      "target": [
        12,
        "data"
      ]
    },
    {
      "source": [
        12,
        "output"
      ],
      "target": [
        13,
        "data"
      ]
    },
    {
      "source": [
        13,
        "output"
      ],
      "target": [
        14,
        "base"
      ]
    },
    {
      "source": [
        11,
        "output"
      ],
      "target": [
        14,
        "data"
      ]
    }
  ]
  };
  
  $.extend(true, templates.ncnr.refl, t);
})();
