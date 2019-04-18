using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;
using System.Drawing;
using System.Threading;
using System.Collections.Generic;
using System.Text;
using System.Data.Common;
using Oracle.ManagedDataAccess.Client;
using BPM;
using YZSoft.Web.Social;

namespace YZSoft.Web.DAL
{
    partial class OracleProvider
    {
        //oo1oo
        public IDataReader GetFavorites(IDbConnection cn, string uid, YZResourceType resType)
        {
            throw new NotImplementedException("Aaaa");
        }

        //oo1oo
        public IDataReader HasFavorited(IDbConnection cn, string uid, YZResourceType resType, string resId)
        {
            throw new NotImplementedException("Aaaa");

        }

        //oo1oo
        public void DeleteFavorite(IDbConnection cn, string uid, YZResourceType resType, string resId)
        {
            throw new NotImplementedException("Aaaa");

        }

        //oo1oo
        public void Insert(IDbConnection cn, Favorite favorite)
        {
            throw new NotImplementedException("Aaaa");

        }

        //oo1oo
        public void UpdateOrderIndex(IDbConnection cn, Favorite favorite)
        {
            throw new NotImplementedException("Aaaa");

        }
    }
}
