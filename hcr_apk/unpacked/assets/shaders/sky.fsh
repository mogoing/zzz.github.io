#ifdef GL_ES
precision lowp float;
#endif


#ifdef GL_ES
varying lowp vec2 v_texCoord;
#else
varying vec2 v_texCoord;
#endif

uniform sampler2D u_texture;
uniform vec4 u_color;

void main()
{
    gl_FragColor = texture2D(u_texture, v_texCoord) * u_color;
}


