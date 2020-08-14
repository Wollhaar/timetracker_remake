if !ls ~/frontend/lib/
  mkdir ~/frontend/lib/
fi else
  echo 'directory exists'
fi
if php -r "!file_exists('~/frontend/lib/jquery/jquery-3.5.1.min.js');"
  if !ls ~/frontend/lib/jquery
    mkdir ~/frontend/lib/jquery
  fi
  php -r "copy('https://code.jquery.com/jquery-3.5.1.min.js', 'jquery-3.5.1.min.js');"
  mv jquery-3.5.1.min.js ./frontend/lib/jquery/jquery-3.5.1.min.js
fi
if !ls ~/frontend/lib/bootstrap
  mkdir ~/frontend/lib/bootstrap
fi
if php -r "!file_exists('~/frontend/lib/bootstrap/bootstrap.min.css');"
  php -r "copy('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css', 'bootstrap.min.css');"
  mv bootstrap.min.css ./frontend/lib/bootstrap/bootstrap.min.css
fi
if php -r "!file_exists('~/frontend/lib/bootstrap/bootstrap.min.js');"
  php -r "copy('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js', 'bootstrap.min.js');"
  mv bootstrap.min.js ./frontend/lib/bootstrap/bootstrap.min.js
fi
if php -r "!file_exists('~/frontend/lib/bootstrap/popper.min.js');"
  php -r "copy('https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js', 'popper.min.js');"
  mv popper.min.js ./frontend/lib/bootstrap/popper.min.js
fi
if !ls ~/frontend/lib/less
  mkdir ~/frontend/lib/less
fi
if php -r "!file_exists('~/frontend/lib/less/less.min.js');"
  wget https://github.com/less/less.js/archive/master.zip && unzip less.js-master.zip
  rm master.zip
  mv less.js-master/ ./frontend/lib/less/less.js
fi

echo 'Frontend Dependencies installed'